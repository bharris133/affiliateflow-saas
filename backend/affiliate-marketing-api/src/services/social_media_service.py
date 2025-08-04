import requests
import json
import base64
import hashlib
import hmac
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import os
from urllib.parse import urlencode
import tweepy
import facebook
from instagram_basic_display import InstagramBasicDisplay
from linkedin_api import Linkedin
import asyncio
import aiohttp

class SocialMediaService:
    """Enhanced social media posting service with multi-platform support"""
    
    def __init__(self):
        self.platforms = {
            'facebook': FacebookPoster(),
            'instagram': InstagramPoster(),
            'twitter': TwitterPoster(),
            'linkedin': LinkedInPoster(),
            'tiktok': TikTokPoster(),
            'youtube': YouTubePoster(),
            'pinterest': PinterestPoster(),
            'reddit': RedditPoster(),
            'telegram': TelegramPoster(),
            'discord': DiscordPoster()
        }
        
    async def post_to_multiple_platforms(self, content: Dict, platforms: List[str], user_credentials: Dict) -> Dict:
        """Post content to multiple social media platforms simultaneously"""
        results = {}
        tasks = []
        
        for platform in platforms:
            if platform in self.platforms:
                task = self._post_to_platform(platform, content, user_credentials.get(platform, {}))
                tasks.append((platform, task))
        
        # Execute all posts concurrently
        for platform, task in tasks:
            try:
                result = await task
                results[platform] = {
                    'success': True,
                    'post_id': result.get('id'),
                    'url': result.get('url'),
                    'engagement': result.get('engagement', {}),
                    'timestamp': datetime.now().isoformat()
                }
            except Exception as e:
                results[platform] = {
                    'success': False,
                    'error': str(e),
                    'timestamp': datetime.now().isoformat()
                }
        
        return results
    
    async def _post_to_platform(self, platform: str, content: Dict, credentials: Dict) -> Dict:
        """Post content to a specific platform"""
        poster = self.platforms[platform]
        return await poster.post(content, credentials)
    
    def schedule_post(self, content: Dict, platforms: List[str], schedule_time: datetime, user_credentials: Dict) -> str:
        """Schedule a post for future publishing"""
        # In production, this would use a task queue like Celery
        schedule_id = hashlib.md5(f"{content['text']}{schedule_time}".encode()).hexdigest()
        
        # Store scheduled post in database (mock implementation)
        scheduled_post = {
            'id': schedule_id,
            'content': content,
            'platforms': platforms,
            'schedule_time': schedule_time.isoformat(),
            'user_credentials': user_credentials,
            'status': 'scheduled'
        }
        
        return schedule_id
    
    def get_analytics(self, platform: str, post_id: str, credentials: Dict) -> Dict:
        """Get analytics for a specific post"""
        poster = self.platforms.get(platform)
        if poster:
            return poster.get_analytics(post_id, credentials)
        return {}
    
    def get_optimal_posting_times(self, platform: str, user_id: str) -> List[Dict]:
        """Get optimal posting times based on audience analysis"""
        # Mock implementation - in production, this would analyze user engagement data
        optimal_times = {
            'facebook': [
                {'day': 'Tuesday', 'time': '09:00', 'engagement_rate': 0.85},
                {'day': 'Wednesday', 'time': '13:00', 'engagement_rate': 0.82},
                {'day': 'Thursday', 'time': '15:00', 'engagement_rate': 0.78}
            ],
            'instagram': [
                {'day': 'Monday', 'time': '11:00', 'engagement_rate': 0.92},
                {'day': 'Wednesday', 'time': '14:00', 'engagement_rate': 0.88},
                {'day': 'Friday', 'time': '17:00', 'engagement_rate': 0.85}
            ],
            'twitter': [
                {'day': 'Tuesday', 'time': '08:00', 'engagement_rate': 0.75},
                {'day': 'Wednesday', 'time': '12:00', 'engagement_rate': 0.73},
                {'day': 'Thursday', 'time': '16:00', 'engagement_rate': 0.70}
            ]
        }
        
        return optimal_times.get(platform, [])

class BasePoster:
    """Base class for social media platform posters"""
    
    async def post(self, content: Dict, credentials: Dict) -> Dict:
        raise NotImplementedError
    
    def get_analytics(self, post_id: str, credentials: Dict) -> Dict:
        raise NotImplementedError
    
    def validate_credentials(self, credentials: Dict) -> bool:
        raise NotImplementedError

class FacebookPoster(BasePoster):
    """Facebook posting implementation"""
    
    async def post(self, content: Dict, credentials: Dict) -> Dict:
        access_token = credentials.get('access_token')
        page_id = credentials.get('page_id')
        
        if not access_token or not page_id:
            raise ValueError("Facebook access token and page ID required")
        
        url = f"https://graph.facebook.com/v18.0/{page_id}/feed"
        
        data = {
            'message': content['text'],
            'access_token': access_token
        }
        
        # Add image if provided
        if content.get('image_url'):
            data['link'] = content['image_url']
        
        # Add video if provided
        if content.get('video_url'):
            data['source'] = content['video_url']
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, data=data) as response:
                result = await response.json()
                
                if response.status == 200:
                    return {
                        'id': result['id'],
                        'url': f"https://facebook.com/{page_id}/posts/{result['id'].split('_')[1]}"
                    }
                else:
                    raise Exception(f"Facebook API error: {result.get('error', {}).get('message', 'Unknown error')}")
    
    def get_analytics(self, post_id: str, credentials: Dict) -> Dict:
        access_token = credentials.get('access_token')
        
        url = f"https://graph.facebook.com/v18.0/{post_id}/insights"
        params = {
            'metric': 'post_impressions,post_engaged_users,post_clicks',
            'access_token': access_token
        }
        
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            return {
                'impressions': data.get('data', [{}])[0].get('values', [{}])[0].get('value', 0),
                'engagement': data.get('data', [{}])[1].get('values', [{}])[0].get('value', 0),
                'clicks': data.get('data', [{}])[2].get('values', [{}])[0].get('value', 0)
            }
        return {}

class InstagramPoster(BasePoster):
    """Instagram posting implementation"""
    
    async def post(self, content: Dict, credentials: Dict) -> Dict:
        access_token = credentials.get('access_token')
        user_id = credentials.get('user_id')
        
        if not access_token or not user_id:
            raise ValueError("Instagram access token and user ID required")
        
        # Instagram requires media to be uploaded first
        if content.get('image_url'):
            # Create media container
            container_url = f"https://graph.facebook.com/v18.0/{user_id}/media"
            container_data = {
                'image_url': content['image_url'],
                'caption': content['text'],
                'access_token': access_token
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(container_url, data=container_data) as response:
                    container_result = await response.json()
                    
                    if response.status != 200:
                        raise Exception(f"Instagram container creation error: {container_result.get('error', {}).get('message', 'Unknown error')}")
                    
                    container_id = container_result['id']
                    
                    # Publish media
                    publish_url = f"https://graph.facebook.com/v18.0/{user_id}/media_publish"
                    publish_data = {
                        'creation_id': container_id,
                        'access_token': access_token
                    }
                    
                    async with session.post(publish_url, data=publish_data) as publish_response:
                        publish_result = await publish_response.json()
                        
                        if publish_response.status == 200:
                            return {
                                'id': publish_result['id'],
                                'url': f"https://instagram.com/p/{publish_result['id']}"
                            }
                        else:
                            raise Exception(f"Instagram publish error: {publish_result.get('error', {}).get('message', 'Unknown error')}")
        
        raise ValueError("Instagram posts require an image")

class TwitterPoster(BasePoster):
    """Twitter/X posting implementation"""
    
    async def post(self, content: Dict, credentials: Dict) -> Dict:
        api_key = credentials.get('api_key')
        api_secret = credentials.get('api_secret')
        access_token = credentials.get('access_token')
        access_token_secret = credentials.get('access_token_secret')
        
        if not all([api_key, api_secret, access_token, access_token_secret]):
            raise ValueError("Twitter API credentials incomplete")
        
        # Using Twitter API v2
        auth = tweepy.OAuth1UserHandler(
            api_key, api_secret, access_token, access_token_secret
        )
        api = tweepy.API(auth)
        client = tweepy.Client(
            consumer_key=api_key,
            consumer_secret=api_secret,
            access_token=access_token,
            access_token_secret=access_token_secret
        )
        
        try:
            # Upload media if provided
            media_ids = []
            if content.get('image_url'):
                # Download and upload image
                image_response = requests.get(content['image_url'])
                if image_response.status_code == 200:
                    media = api.media_upload(filename="temp_image.jpg", file=image_response.content)
                    media_ids.append(media.media_id)
            
            # Post tweet
            tweet = client.create_tweet(
                text=content['text'][:280],  # Twitter character limit
                media_ids=media_ids if media_ids else None
            )
            
            return {
                'id': tweet.data['id'],
                'url': f"https://twitter.com/user/status/{tweet.data['id']}"
            }
            
        except Exception as e:
            raise Exception(f"Twitter API error: {str(e)}")

class LinkedInPoster(BasePoster):
    """LinkedIn posting implementation"""
    
    async def post(self, content: Dict, credentials: Dict) -> Dict:
        access_token = credentials.get('access_token')
        person_id = credentials.get('person_id')
        
        if not access_token or not person_id:
            raise ValueError("LinkedIn access token and person ID required")
        
        url = "https://api.linkedin.com/v2/ugcPosts"
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0'
        }
        
        post_data = {
            "author": f"urn:li:person:{person_id}",
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {
                        "text": content['text']
                    },
                    "shareMediaCategory": "NONE"
                }
            },
            "visibility": {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
            }
        }
        
        # Add media if provided
        if content.get('image_url'):
            post_data["specificContent"]["com.linkedin.ugc.ShareContent"]["shareMediaCategory"] = "IMAGE"
            post_data["specificContent"]["com.linkedin.ugc.ShareContent"]["media"] = [
                {
                    "status": "READY",
                    "description": {
                        "text": content.get('image_alt', '')
                    },
                    "media": content['image_url']
                }
            ]
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=post_data) as response:
                if response.status == 201:
                    result = await response.json()
                    post_id = result['id']
                    return {
                        'id': post_id,
                        'url': f"https://linkedin.com/feed/update/{post_id}"
                    }
                else:
                    error_text = await response.text()
                    raise Exception(f"LinkedIn API error: {error_text}")

class TikTokPoster(BasePoster):
    """TikTok posting implementation"""
    
    async def post(self, content: Dict, credentials: Dict) -> Dict:
        # TikTok API implementation would go here
        # Note: TikTok's API has strict requirements and approval process
        raise NotImplementedError("TikTok posting requires approved developer account")

class YouTubePoster(BasePoster):
    """YouTube posting implementation"""
    
    async def post(self, content: Dict, credentials: Dict) -> Dict:
        # YouTube API implementation for video uploads would go here
        raise NotImplementedError("YouTube posting requires video content")

class PinterestPoster(BasePoster):
    """Pinterest posting implementation"""
    
    async def post(self, content: Dict, credentials: Dict) -> Dict:
        access_token = credentials.get('access_token')
        board_id = credentials.get('board_id')
        
        if not access_token or not board_id:
            raise ValueError("Pinterest access token and board ID required")
        
        url = "https://api.pinterest.com/v5/pins"
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        pin_data = {
            'board_id': board_id,
            'description': content['text'],
            'link': content.get('link_url', ''),
            'media_source': {
                'source_type': 'image_url',
                'url': content.get('image_url', '')
            }
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=pin_data) as response:
                if response.status == 201:
                    result = await response.json()
                    return {
                        'id': result['id'],
                        'url': result['url']
                    }
                else:
                    error_text = await response.text()
                    raise Exception(f"Pinterest API error: {error_text}")

class RedditPoster(BasePoster):
    """Reddit posting implementation"""
    
    async def post(self, content: Dict, credentials: Dict) -> Dict:
        # Reddit API implementation would go here
        # Requires careful handling of subreddit rules and rate limits
        raise NotImplementedError("Reddit posting requires subreddit-specific implementation")

class TelegramPoster(BasePoster):
    """Telegram posting implementation"""
    
    async def post(self, content: Dict, credentials: Dict) -> Dict:
        bot_token = credentials.get('bot_token')
        chat_id = credentials.get('chat_id')
        
        if not bot_token or not chat_id:
            raise ValueError("Telegram bot token and chat ID required")
        
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        
        data = {
            'chat_id': chat_id,
            'text': content['text'],
            'parse_mode': 'HTML'
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=data) as response:
                if response.status == 200:
                    result = await response.json()
                    message_id = result['result']['message_id']
                    return {
                        'id': str(message_id),
                        'url': f"https://t.me/{chat_id}/{message_id}"
                    }
                else:
                    error_text = await response.text()
                    raise Exception(f"Telegram API error: {error_text}")

class DiscordPoster(BasePoster):
    """Discord posting implementation"""
    
    async def post(self, content: Dict, credentials: Dict) -> Dict:
        webhook_url = credentials.get('webhook_url')
        
        if not webhook_url:
            raise ValueError("Discord webhook URL required")
        
        data = {
            'content': content['text']
        }
        
        # Add embed if image provided
        if content.get('image_url'):
            data['embeds'] = [{
                'image': {'url': content['image_url']},
                'description': content.get('image_alt', '')
            }]
        
        async with aiohttp.ClientSession() as session:
            async with session.post(webhook_url, json=data) as response:
                if response.status == 204:
                    return {
                        'id': 'discord_message',
                        'url': webhook_url
                    }
                else:
                    error_text = await response.text()
                    raise Exception(f"Discord webhook error: {error_text}")

# Content optimization utilities
class ContentOptimizer:
    """Optimize content for different social media platforms"""
    
    @staticmethod
    def optimize_for_platform(content: Dict, platform: str) -> Dict:
        """Optimize content based on platform requirements"""
        optimized = content.copy()
        
        platform_limits = {
            'twitter': {'text': 280, 'hashtags': 2},
            'instagram': {'text': 2200, 'hashtags': 30},
            'facebook': {'text': 63206, 'hashtags': 5},
            'linkedin': {'text': 3000, 'hashtags': 3},
            'pinterest': {'text': 500, 'hashtags': 20}
        }
        
        limits = platform_limits.get(platform, {})
        
        # Truncate text if needed
        if 'text' in limits and len(optimized['text']) > limits['text']:
            optimized['text'] = optimized['text'][:limits['text']-3] + '...'
        
        # Optimize hashtags
        if 'hashtags' in limits and optimized.get('hashtags'):
            optimized['hashtags'] = optimized['hashtags'][:limits['hashtags']]
        
        # Platform-specific optimizations
        if platform == 'twitter':
            # Add thread support for longer content
            if len(content['text']) > 280:
                optimized['thread'] = ContentOptimizer._create_twitter_thread(content['text'])
        
        elif platform == 'instagram':
            # Ensure image is provided
            if not optimized.get('image_url'):
                optimized['requires_image'] = True
        
        elif platform == 'linkedin':
            # Professional tone adjustments
            optimized['text'] = ContentOptimizer._professionalize_text(optimized['text'])
        
        return optimized
    
    @staticmethod
    def _create_twitter_thread(text: str) -> List[str]:
        """Split long text into Twitter thread"""
        words = text.split()
        threads = []
        current_thread = ""
        
        for word in words:
            if len(current_thread + " " + word) <= 270:  # Leave space for thread numbering
                current_thread += " " + word if current_thread else word
            else:
                threads.append(current_thread)
                current_thread = word
        
        if current_thread:
            threads.append(current_thread)
        
        # Add thread numbering
        if len(threads) > 1:
            for i, thread in enumerate(threads):
                threads[i] = f"{i+1}/{len(threads)} {thread}"
        
        return threads
    
    @staticmethod
    def _professionalize_text(text: str) -> str:
        """Make text more professional for LinkedIn"""
        # Simple implementation - in production, this could use NLP
        professional_replacements = {
            'awesome': 'excellent',
            'cool': 'impressive',
            'guys': 'everyone',
            'hey': 'hello'
        }
        
        for casual, professional in professional_replacements.items():
            text = text.replace(casual, professional)
        
        return text

# Analytics and reporting
class SocialMediaAnalytics:
    """Analytics service for social media performance"""
    
    def __init__(self):
        self.platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'pinterest']
    
    def get_comprehensive_analytics(self, user_id: str, date_range: Dict) -> Dict:
        """Get analytics across all connected platforms"""
        analytics = {}
        
        for platform in self.platforms:
            analytics[platform] = self._get_platform_analytics(platform, user_id, date_range)
        
        # Calculate overall metrics
        analytics['summary'] = self._calculate_summary_metrics(analytics)
        
        return analytics
    
    def _get_platform_analytics(self, platform: str, user_id: str, date_range: Dict) -> Dict:
        """Get analytics for a specific platform"""
        # Mock implementation - in production, this would query actual APIs
        return {
            'posts': 15,
            'impressions': 12500,
            'engagement': 850,
            'clicks': 125,
            'followers_gained': 45,
            'engagement_rate': 6.8,
            'best_performing_post': {
                'id': 'post_123',
                'impressions': 2500,
                'engagement': 180
            }
        }
    
    def _calculate_summary_metrics(self, platform_analytics: Dict) -> Dict:
        """Calculate summary metrics across all platforms"""
        total_posts = sum(data.get('posts', 0) for data in platform_analytics.values() if isinstance(data, dict))
        total_impressions = sum(data.get('impressions', 0) for data in platform_analytics.values() if isinstance(data, dict))
        total_engagement = sum(data.get('engagement', 0) for data in platform_analytics.values() if isinstance(data, dict))
        
        return {
            'total_posts': total_posts,
            'total_impressions': total_impressions,
            'total_engagement': total_engagement,
            'average_engagement_rate': (total_engagement / total_impressions * 100) if total_impressions > 0 else 0,
            'most_active_platform': max(platform_analytics.keys(), 
                                      key=lambda k: platform_analytics[k].get('posts', 0) if isinstance(platform_analytics[k], dict) else 0)
        }

