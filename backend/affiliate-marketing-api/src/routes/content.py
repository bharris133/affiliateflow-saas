from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import openai
import json
import random
from datetime import datetime
from src.models.content import db, GeneratedContent, ContentType, ContentStatus
from src.models.subscription import Subscription

content_bp = Blueprint('content', __name__)

# Initialize OpenAI client
openai_client = openai.OpenAI()

@content_bp.route('/generate', methods=['POST'])
@cross_origin()
def generate_content():
    """Generate AI content based on user request"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        # Check subscription limits
        subscription = Subscription.query.filter_by(user_id=user_id).first()
        if not subscription or not subscription.can_use_feature('content_generated'):
            return jsonify({
                'error': 'Content generation limit reached for your subscription tier',
                'upgrade_required': True
            }), 403
        
        # Extract request parameters
        content_type = data.get('content_type', 'blog_post')
        niche = data.get('niche', 'general')
        topic = data.get('topic', '')
        target_audience = data.get('target_audience', 'general audience')
        word_count = data.get('word_count', 1000)
        keywords = data.get('keywords', [])
        affiliate_products = data.get('affiliate_products', [])
        tone = data.get('tone', 'professional')
        
        # Generate content using AI
        generated_data = _generate_ai_content(
            content_type, niche, topic, target_audience, 
            word_count, keywords, affiliate_products, tone
        )
        
        # Save to database
        content = GeneratedContent(
            user_id=user_id,
            title=generated_data['title'],
            content=generated_data['content'],
            content_type=ContentType(content_type),
            niche=niche,
            target_audience=target_audience,
            word_count=len(generated_data['content'].split()),
            meta_description=generated_data['meta_description'],
            email_subject=generated_data['email_subject']
        )
        
        content.set_keywords_list(keywords)
        content.set_social_posts_list(generated_data['social_media_posts'])
        content.set_affiliate_links_dict(generated_data['affiliate_links'])
        
        db.session.add(content)
        db.session.commit()
        
        # Update subscription usage
        subscription.increment_usage('content_generated')
        
        return jsonify({
            'success': True,
            'content': content.to_dict(),
            'usage': {
                'remaining': subscription.get_limits()['content_per_month'] - subscription.content_generated_count
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_bp.route('/list', methods=['GET'])
@cross_origin()
def list_content():
    """Get user's generated content"""
    try:
        user_id = request.args.get('user_id')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        content_type = request.args.get('content_type')
        status = request.args.get('status')
        
        query = GeneratedContent.query.filter_by(user_id=user_id)
        
        if content_type:
            query = query.filter_by(content_type=ContentType(content_type))
        
        if status:
            query = query.filter_by(status=ContentStatus(status))
        
        query = query.order_by(GeneratedContent.created_at.desc())
        
        pagination = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        content_list = [content.to_dict() for content in pagination.items]
        
        return jsonify({
            'success': True,
            'content': content_list,
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

@content_bp.route('/<int:content_id>', methods=['GET'])
@cross_origin()
def get_content(content_id):
    """Get specific content by ID"""
    try:
        content = GeneratedContent.query.get_or_404(content_id)
        return jsonify({
            'success': True,
            'content': content.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_bp.route('/<int:content_id>', methods=['PUT'])
@cross_origin()
def update_content(content_id):
    """Update content"""
    try:
        content = GeneratedContent.query.get_or_404(content_id)
        data = request.get_json()
        
        # Update fields
        if 'title' in data:
            content.title = data['title']
        if 'content' in data:
            content.content = data['content']
            content.word_count = len(data['content'].split())
        if 'status' in data:
            content.status = ContentStatus(data['status'])
        if 'meta_description' in data:
            content.meta_description = data['meta_description']
        if 'keywords' in data:
            content.set_keywords_list(data['keywords'])
        if 'scheduled_for' in data:
            content.scheduled_for = datetime.fromisoformat(data['scheduled_for'])
        
        content.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'content': content.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_bp.route('/<int:content_id>', methods=['DELETE'])
@cross_origin()
def delete_content(content_id):
    """Delete content"""
    try:
        content = GeneratedContent.query.get_or_404(content_id)
        db.session.delete(content)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Content deleted successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_bp.route('/templates', methods=['GET'])
@cross_origin()
def get_content_templates():
    """Get content generation templates"""
    templates = {
        'blog_post': [
            {
                'name': 'Product Review',
                'description': 'Comprehensive product review with pros, cons, and recommendations',
                'prompt_template': 'Write a detailed review of {product} for {audience}, highlighting benefits and addressing common concerns'
            },
            {
                'name': 'How-To Guide',
                'description': 'Step-by-step tutorial or guide',
                'prompt_template': 'Create a comprehensive how-to guide about {topic} for {audience}'
            },
            {
                'name': 'Comparison Article',
                'description': 'Compare multiple products or services',
                'prompt_template': 'Write a detailed comparison between {products} for {audience}'
            },
            {
                'name': 'Listicle',
                'description': 'List-based article with tips or recommendations',
                'prompt_template': 'Create a list of the best {topic} for {audience} with detailed explanations'
            }
        ],
        'social_media': [
            {
                'name': 'Engagement Post',
                'description': 'Post designed to drive engagement and comments',
                'prompt_template': 'Create an engaging social media post about {topic} that encourages audience interaction'
            },
            {
                'name': 'Educational Post',
                'description': 'Informative post that provides value',
                'prompt_template': 'Write an educational social media post about {topic} for {audience}'
            },
            {
                'name': 'Promotional Post',
                'description': 'Post promoting a product or service',
                'prompt_template': 'Create a promotional post for {product} that highlights benefits without being overly salesy'
            }
        ],
        'email': [
            {
                'name': 'Welcome Email',
                'description': 'Welcome new subscribers',
                'prompt_template': 'Write a warm welcome email for new subscribers interested in {topic}'
            },
            {
                'name': 'Newsletter',
                'description': 'Regular newsletter with updates and tips',
                'prompt_template': 'Create a newsletter about {topic} with valuable tips and updates for {audience}'
            },
            {
                'name': 'Product Promotion',
                'description': 'Email promoting a specific product',
                'prompt_template': 'Write a promotional email for {product} that provides value and drives conversions'
            }
        ]
    }
    
    return jsonify({
        'success': True,
        'templates': templates
    })

@content_bp.route('/analytics', methods=['GET'])
@cross_origin()
def get_content_analytics():
    """Get content performance analytics"""
    try:
        user_id = request.args.get('user_id')
        days = int(request.args.get('days', 30))
        
        # Get content analytics
        from datetime import timedelta
        start_date = datetime.utcnow() - timedelta(days=days)
        
        content_query = GeneratedContent.query.filter(
            GeneratedContent.user_id == user_id,
            GeneratedContent.created_at >= start_date
        )
        
        total_content = content_query.count()
        total_views = db.session.query(db.func.sum(GeneratedContent.views)).filter(
            GeneratedContent.user_id == user_id,
            GeneratedContent.created_at >= start_date
        ).scalar() or 0
        
        total_clicks = db.session.query(db.func.sum(GeneratedContent.clicks)).filter(
            GeneratedContent.user_id == user_id,
            GeneratedContent.created_at >= start_date
        ).scalar() or 0
        
        total_revenue = db.session.query(db.func.sum(GeneratedContent.revenue)).filter(
            GeneratedContent.user_id == user_id,
            GeneratedContent.created_at >= start_date
        ).scalar() or 0
        
        # Top performing content
        top_content = content_query.order_by(GeneratedContent.revenue.desc()).limit(5).all()
        
        # Content by type
        content_by_type = db.session.query(
            GeneratedContent.content_type,
            db.func.count(GeneratedContent.id)
        ).filter(
            GeneratedContent.user_id == user_id,
            GeneratedContent.created_at >= start_date
        ).group_by(GeneratedContent.content_type).all()
        
        return jsonify({
            'success': True,
            'analytics': {
                'total_content': total_content,
                'total_views': total_views,
                'total_clicks': total_clicks,
                'total_revenue': float(total_revenue),
                'avg_ctr': (total_clicks / total_views * 100) if total_views > 0 else 0,
                'top_content': [content.to_dict() for content in top_content],
                'content_by_type': [
                    {'type': content_type.value, 'count': count}
                    for content_type, count in content_by_type
                ]
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def _generate_ai_content(content_type, niche, topic, target_audience, word_count, keywords, affiliate_products, tone):
    """Generate content using OpenAI API"""
    
    # Build comprehensive prompt
    prompt = f"""
    Create {content_type} content about: {topic}
    
    Target Audience: {target_audience}
    Niche: {niche}
    Tone: {tone}
    Word Count: {word_count}
    Keywords to include: {', '.join(keywords)}
    Affiliate Products to mention: {', '.join(affiliate_products)}
    
    Requirements:
    - Provide genuine value to readers
    - Include natural mentions of affiliate products
    - Use engaging headlines and subheadings
    - Include clear call-to-action elements
    - Optimize for SEO with target keywords
    - Maintain authenticity and trustworthiness
    
    Please provide:
    1. A compelling title
    2. The main content
    3. A meta description (150 characters max)
    4. An email subject line
    5. 3 social media post variations
    6. Suggested affiliate link placements
    """
    
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system", 
                    "content": "You are an expert content creator specializing in affiliate marketing. Create high-converting, valuable content that naturally incorporates affiliate recommendations."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=min(4000, word_count * 2),
            temperature=0.7
        )
        
        content_text = response.choices[0].message.content
        
        # Parse the generated content (simplified parsing)
        lines = content_text.split('\n')
        title = topic if not lines else lines[0].strip('#').strip()
        
        # Generate structured response
        return {
            'title': title,
            'content': content_text,
            'meta_description': f"Comprehensive guide to {topic} with expert tips and recommendations for {target_audience}.",
            'email_subject': f"🔥 The Ultimate {topic} Guide You've Been Waiting For",
            'social_media_posts': [
                f"🌟 Just discovered amazing insights about {topic}! Check out my latest guide. #tips #guide",
                f"💡 Want to know the secret to {topic}? I've got you covered! #mustread #tips",
                f"🚀 Game-changing information about {topic} that you need to see! #guide #tips"
            ],
            'affiliate_links': {product: f"https://affiliate-link-for-{product.lower().replace(' ', '-')}.com" for product in affiliate_products}
        }
        
    except Exception as e:
        # Fallback content generation
        return {
            'title': f"Ultimate Guide to {topic}",
            'content': f"This is a comprehensive guide about {topic} for {target_audience}. [Content would be generated here with proper AI integration]",
            'meta_description': f"Learn everything about {topic} with our comprehensive guide.",
            'email_subject': f"Your Guide to {topic}",
            'social_media_posts': [
                f"Check out this guide about {topic}! #guide #tips",
                f"Everything you need to know about {topic}! #education",
                f"New guide: {topic} made simple! #howto"
            ],
            'affiliate_links': {product: f"https://example.com/{product}" for product in affiliate_products}
        }

