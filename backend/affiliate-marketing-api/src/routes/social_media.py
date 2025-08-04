from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import json
import random
from datetime import datetime, timedelta
from src.models.content import db, SocialMediaPost
from src.models.subscription import Subscription

social_media_bp = Blueprint('social_media', __name__)

# Platform configurations
PLATFORM_CONFIGS = {
    'instagram': {
        'max_length': 2200,
        'hashtag_limit': 30,
        'optimal_times': ['09:00', '15:00', '19:00'],
        'supported_media': ['image', 'video'],
        'features': ['posts', 'stories', 'reels']
    },
    'tiktok': {
        'max_length': 300,
        'hashtag_limit': 20,
        'optimal_times': ['12:00', '18:00', '21:00'],
        'supported_media': ['video'],
        'features': ['videos']
    },
    'facebook': {
        'max_length': 63206,
        'hashtag_limit': 10,
        'optimal_times': ['08:00', '14:00', '20:00'],
        'supported_media': ['image', 'video', 'link'],
        'features': ['posts', 'stories']
    },
    'pinterest': {
        'max_length': 500,
        'hashtag_limit': 20,
        'optimal_times': ['11:00', '16:00', '22:00'],
        'supported_media': ['image'],
        'features': ['pins', 'boards']
    },
    'youtube': {
        'max_length': 5000,
        'hashtag_limit': 15,
        'optimal_times': ['10:00'],
        'supported_media': ['video'],
        'features': ['videos', 'shorts', 'community']
    },
    'linkedin': {
        'max_length': 3000,
        'hashtag_limit': 5,
        'optimal_times': ['09:00', '12:00', '17:00'],
        'supported_media': ['image', 'video', 'document'],
        'features': ['posts', 'articles']
    },
    'twitter': {
        'max_length': 280,
        'hashtag_limit': 2,
        'optimal_times': ['09:00', '12:00', '15:00', '18:00'],
        'supported_media': ['image', 'video', 'gif'],
        'features': ['tweets', 'threads']
    }
}

@social_media_bp.route('/platforms', methods=['GET'])
@cross_origin()
def get_platforms():
    """Get available social media platforms and their configurations"""
    return jsonify({
        'success': True,
        'platforms': PLATFORM_CONFIGS
    })

@social_media_bp.route('/create-post', methods=['POST'])
@cross_origin()
def create_social_post():
    """Create a social media post"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        # Check subscription limits
        subscription = Subscription.query.filter_by(user_id=user_id).first()
        if not subscription or not subscription.can_use_feature('social_posts'):
            return jsonify({
                'error': 'Social media posting limit reached for your subscription tier',
                'upgrade_required': True
            }), 403
        
        platform = data.get('platform')
        content = data.get('content', '')
        hashtags = data.get('hashtags', [])
        media_urls = data.get('media_urls', [])
        scheduled_time = data.get('scheduled_time')
        content_id = data.get('content_id')
        
        # Validate platform
        if platform not in PLATFORM_CONFIGS:
            return jsonify({'error': f'Unsupported platform: {platform}'}), 400
        
        # Optimize content for platform
        optimized_content = _optimize_content_for_platform(content, platform, hashtags)
        
        # Create social media post
        post = SocialMediaPost(
            user_id=user_id,
            content_id=content_id,
            platform=platform,
            content=optimized_content['content']
        )
        
        post.set_hashtags_list(optimized_content['hashtags'])
        post.set_media_urls_list(media_urls)
        
        if scheduled_time:
            post.scheduled_time = datetime.fromisoformat(scheduled_time)
            post.status = 'scheduled'
        else:
            post.status = 'draft'
        
        db.session.add(post)
        db.session.commit()
        
        # Update subscription usage
        subscription.increment_usage('social_posts')
        
        return jsonify({
            'success': True,
            'post': post.to_dict(),
            'usage': {
                'remaining': subscription.get_limits()['social_posts_per_month'] - subscription.social_posts_count
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@social_media_bp.route('/create-cross-platform', methods=['POST'])
@cross_origin()
def create_cross_platform_posts():
    """Create optimized posts for multiple platforms"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        # Check subscription limits
        subscription = Subscription.query.filter_by(user_id=user_id).first()
        if not subscription:
            return jsonify({'error': 'Subscription not found'}), 404
        
        content = data.get('content', '')
        hashtags = data.get('hashtags', [])
        media_urls = data.get('media_urls', [])
        platforms = data.get('platforms', [])
        scheduled_time = data.get('scheduled_time')
        content_id = data.get('content_id')
        
        # Check if user can create posts for all platforms
        if not subscription.can_use_feature('social_posts', len(platforms)):
            return jsonify({
                'error': 'Social media posting limit reached for your subscription tier',
                'upgrade_required': True
            }), 403
        
        # Get user's allowed platforms
        allowed_platforms = subscription.get_limits()['platforms']
        platforms = [p for p in platforms if p in allowed_platforms]
        
        created_posts = []
        
        for platform in platforms:
            if platform not in PLATFORM_CONFIGS:
                continue
            
            # Optimize content for each platform
            optimized_content = _optimize_content_for_platform(content, platform, hashtags)
            
            # Create post
            post = SocialMediaPost(
                user_id=user_id,
                content_id=content_id,
                platform=platform,
                content=optimized_content['content']
            )
            
            post.set_hashtags_list(optimized_content['hashtags'])
            post.set_media_urls_list(media_urls)
            
            if scheduled_time:
                # Stagger posts across platforms
                base_time = datetime.fromisoformat(scheduled_time)
                platform_delay = len(created_posts) * 15  # 15 minutes between platforms
                post.scheduled_time = base_time + timedelta(minutes=platform_delay)
                post.status = 'scheduled'
            else:
                post.status = 'draft'
            
            db.session.add(post)
            created_posts.append(post)
        
        db.session.commit()
        
        # Update subscription usage
        subscription.increment_usage('social_posts', len(created_posts))
        
        return jsonify({
            'success': True,
            'posts': [post.to_dict() for post in created_posts],
            'usage': {
                'remaining': subscription.get_limits()['social_posts_per_month'] - subscription.social_posts_count
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@social_media_bp.route('/posts', methods=['GET'])
@cross_origin()
def get_posts():
    """Get user's social media posts"""
    try:
        user_id = request.args.get('user_id')
        platform = request.args.get('platform')
        status = request.args.get('status')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        query = SocialMediaPost.query.filter_by(user_id=user_id)
        
        if platform:
            query = query.filter_by(platform=platform)
        
        if status:
            query = query.filter_by(status=status)
        
        query = query.order_by(SocialMediaPost.created_at.desc())
        
        pagination = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        posts = [post.to_dict() for post in pagination.items]
        
        return jsonify({
            'success': True,
            'posts': posts,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@social_media_bp.route('/posts/<int:post_id>', methods=['PUT'])
@cross_origin()
def update_post(post_id):
    """Update a social media post"""
    try:
        post = SocialMediaPost.query.get_or_404(post_id)
        data = request.get_json()
        
        # Update fields
        if 'content' in data:
            post.content = data['content']
        if 'hashtags' in data:
            post.set_hashtags_list(data['hashtags'])
        if 'media_urls' in data:
            post.set_media_urls_list(data['media_urls'])
        if 'scheduled_time' in data:
            post.scheduled_time = datetime.fromisoformat(data['scheduled_time'])
        if 'status' in data:
            post.status = data['status']
        
        post.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'post': post.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@social_media_bp.route('/posts/<int:post_id>', methods=['DELETE'])
@cross_origin()
def delete_post(post_id):
    """Delete a social media post"""
    try:
        post = SocialMediaPost.query.get_or_404(post_id)
        db.session.delete(post)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Post deleted successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@social_media_bp.route('/publish/<int:post_id>', methods=['POST'])
@cross_origin()
def publish_post(post_id):
    """Publish a social media post immediately"""
    try:
        post = SocialMediaPost.query.get_or_404(post_id)
        
        # Simulate publishing to platform
        success = _publish_to_platform(post)
        
        if success:
            post.status = 'published'
            post.published_time = datetime.utcnow()
            post.platform_post_id = f"{post.platform}_{random.randint(100000, 999999)}"
            post.platform_url = f"https://{post.platform}.com/post/{post.platform_post_id}"
        else:
            post.status = 'failed'
        
        db.session.commit()
        
        return jsonify({
            'success': success,
            'post': post.to_dict(),
            'message': 'Post published successfully' if success else 'Failed to publish post'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@social_media_bp.route('/schedule-optimal', methods=['POST'])
@cross_origin()
def schedule_optimal_times():
    """Schedule posts at optimal times for each platform"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        post_ids = data.get('post_ids', [])
        
        posts = SocialMediaPost.query.filter(
            SocialMediaPost.id.in_(post_ids),
            SocialMediaPost.user_id == user_id
        ).all()
        
        for post in posts:
            platform_config = PLATFORM_CONFIGS.get(post.platform, {})
            optimal_times = platform_config.get('optimal_times', ['12:00'])
            
            # Choose random optimal time
            optimal_time = random.choice(optimal_times)
            hour, minute = map(int, optimal_time.split(':'))
            
            # Schedule for next occurrence of optimal time
            now = datetime.utcnow()
            scheduled_time = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
            
            if scheduled_time <= now:
                scheduled_time += timedelta(days=1)
            
            post.scheduled_time = scheduled_time
            post.status = 'scheduled'
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Scheduled {len(posts)} posts at optimal times',
            'posts': [post.to_dict() for post in posts]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@social_media_bp.route('/analytics', methods=['GET'])
@cross_origin()
def get_social_analytics():
    """Get social media analytics"""
    try:
        user_id = request.args.get('user_id')
        days = int(request.args.get('days', 30))
        platform = request.args.get('platform')
        
        from datetime import timedelta
        start_date = datetime.utcnow() - timedelta(days=days)
        
        query = SocialMediaPost.query.filter(
            SocialMediaPost.user_id == user_id,
            SocialMediaPost.created_at >= start_date
        )
        
        if platform:
            query = query.filter_by(platform=platform)
        
        posts = query.all()
        
        # Calculate analytics
        total_posts = len(posts)
        total_likes = sum(post.likes for post in posts)
        total_comments = sum(post.comments for post in posts)
        total_shares = sum(post.shares for post in posts)
        total_clicks = sum(post.clicks for post in posts)
        total_reach = sum(post.reach for post in posts)
        total_impressions = sum(post.impressions for post in posts)
        
        # Posts by platform
        posts_by_platform = {}
        for post in posts:
            if post.platform not in posts_by_platform:
                posts_by_platform[post.platform] = {
                    'count': 0,
                    'likes': 0,
                    'comments': 0,
                    'shares': 0,
                    'clicks': 0,
                    'reach': 0,
                    'impressions': 0
                }
            
            posts_by_platform[post.platform]['count'] += 1
            posts_by_platform[post.platform]['likes'] += post.likes
            posts_by_platform[post.platform]['comments'] += post.comments
            posts_by_platform[post.platform]['shares'] += post.shares
            posts_by_platform[post.platform]['clicks'] += post.clicks
            posts_by_platform[post.platform]['reach'] += post.reach
            posts_by_platform[post.platform]['impressions'] += post.impressions
        
        # Top performing posts
        top_posts = sorted(posts, key=lambda p: p.likes + p.comments + p.shares, reverse=True)[:5]
        
        return jsonify({
            'success': True,
            'analytics': {
                'total_posts': total_posts,
                'total_engagement': total_likes + total_comments + total_shares,
                'total_likes': total_likes,
                'total_comments': total_comments,
                'total_shares': total_shares,
                'total_clicks': total_clicks,
                'total_reach': total_reach,
                'total_impressions': total_impressions,
                'engagement_rate': (total_likes + total_comments + total_shares) / total_impressions * 100 if total_impressions > 0 else 0,
                'click_through_rate': total_clicks / total_impressions * 100 if total_impressions > 0 else 0,
                'posts_by_platform': posts_by_platform,
                'top_posts': [post.to_dict() for post in top_posts]
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@social_media_bp.route('/hashtag-suggestions', methods=['POST'])
@cross_origin()
def get_hashtag_suggestions():
    """Get hashtag suggestions for content"""
    try:
        data = request.get_json()
        content = data.get('content', '')
        platform = data.get('platform', 'instagram')
        niche = data.get('niche', 'general')
        
        # Generate hashtag suggestions based on content and niche
        suggestions = _generate_hashtag_suggestions(content, platform, niche)
        
        return jsonify({
            'success': True,
            'hashtags': suggestions
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def _optimize_content_for_platform(content, platform, hashtags):
    """Optimize content for specific platform"""
    platform_config = PLATFORM_CONFIGS.get(platform, {})
    max_length = platform_config.get('max_length', 1000)
    hashtag_limit = platform_config.get('hashtag_limit', 10)
    
    # Truncate content if needed
    if len(content) > max_length:
        content = content[:max_length-3] + "..."
    
    # Limit hashtags
    hashtags = hashtags[:hashtag_limit]
    
    # Platform-specific optimizations
    if platform == 'instagram':
        content += "\n\n💡 Save this post for later!"
        content += "\n👥 Tag someone who needs to see this!"
    elif platform == 'tiktok':
        content += "\n\n🔥 Follow for more tips!"
        content += "\n💬 Comment your thoughts below!"
    elif platform == 'facebook':
        if not content.startswith(("🔥", "💡", "🚀", "⚡")):
            content = "💡 " + content
    elif platform == 'pinterest':
        content += "\n\n📌 Save to your board!"
        content += "\n🔗 Click for full guide!"
    elif platform == 'youtube':
        content += "\n\n📺 Subscribe for more content like this!"
        content += "\n👍 Like this video if it helped you!"
    elif platform == 'linkedin':
        content += "\n\n💼 What's your experience with this?"
        content += "\n🔗 Connect with me for more insights!"
    elif platform == 'twitter':
        content += "\n\n🧵 Thread below 👇"
        content += "\n🔄 RT if you found this helpful!"
    
    return {
        'content': content,
        'hashtags': hashtags
    }

def _publish_to_platform(post):
    """Simulate publishing to social media platform"""
    # In a real implementation, this would use platform APIs
    # For now, we'll simulate success/failure
    
    # Simulate 95% success rate
    success = random.random() < 0.95
    
    if success:
        # Simulate some initial engagement
        post.likes = random.randint(5, 50)
        post.comments = random.randint(0, 10)
        post.shares = random.randint(0, 5)
        post.clicks = random.randint(2, 20)
        post.reach = random.randint(100, 1000)
        post.impressions = random.randint(200, 2000)
    
    return success

def _generate_hashtag_suggestions(content, platform, niche):
    """Generate hashtag suggestions based on content and niche"""
    
    # Base hashtags by niche
    niche_hashtags = {
        'travel': ['#travel', '#wanderlust', '#explore', '#adventure', '#vacation', '#travelgram', '#instatravel', '#traveling', '#travelphotography', '#backpacking'],
        'productivity': ['#productivity', '#entrepreneur', '#business', '#success', '#motivation', '#goals', '#hustle', '#mindset', '#leadership', '#growth'],
        'lifestyle': ['#lifestyle', '#inspiration', '#wellness', '#selfcare', '#mindfulness', '#happiness', '#positivity', '#life', '#daily', '#routine'],
        'food': ['#food', '#foodie', '#delicious', '#yummy', '#cooking', '#recipe', '#foodporn', '#instafood', '#chef', '#kitchen'],
        'fitness': ['#fitness', '#workout', '#gym', '#health', '#fit', '#training', '#exercise', '#motivation', '#strength', '#cardio'],
        'fashion': ['#fashion', '#style', '#outfit', '#ootd', '#fashionista', '#trendy', '#stylish', '#look', '#clothing', '#accessories']
    }
    
    # Platform-specific hashtags
    platform_hashtags = {
        'instagram': ['#instagood', '#photooftheday', '#instadaily', '#follow', '#like4like'],
        'tiktok': ['#fyp', '#foryou', '#viral', '#trending', '#tiktok'],
        'facebook': ['#facebook', '#social', '#community', '#share'],
        'pinterest': ['#pinterest', '#pinit', '#inspiration', '#ideas'],
        'youtube': ['#youtube', '#subscribe', '#video', '#content'],
        'linkedin': ['#linkedin', '#professional', '#networking', '#career'],
        'twitter': ['#twitter', '#tweet', '#follow', '#retweet']
    }
    
    # Content-based hashtags (extract keywords from content)
    content_words = content.lower().split()
    content_hashtags = []
    
    # Common keywords that make good hashtags
    good_hashtag_words = [
        'tips', 'guide', 'how', 'best', 'top', 'amazing', 'awesome', 'great', 'new', 'free',
        'easy', 'simple', 'quick', 'fast', 'effective', 'powerful', 'ultimate', 'complete',
        'beginner', 'advanced', 'pro', 'expert', 'secret', 'hack', 'trick', 'method'
    ]
    
    for word in content_words:
        if word in good_hashtag_words and len(word) > 3:
            content_hashtags.append(f'#{word}')
    
    # Combine all hashtags
    all_hashtags = []
    all_hashtags.extend(niche_hashtags.get(niche, []))
    all_hashtags.extend(platform_hashtags.get(platform, []))
    all_hashtags.extend(content_hashtags[:5])  # Limit content hashtags
    
    # Remove duplicates and limit based on platform
    platform_config = PLATFORM_CONFIGS.get(platform, {})
    hashtag_limit = platform_config.get('hashtag_limit', 10)
    
    unique_hashtags = list(dict.fromkeys(all_hashtags))  # Remove duplicates while preserving order
    
    return unique_hashtags[:hashtag_limit]

