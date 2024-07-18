from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification,Message
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@receiver(post_save, sender=Notification)
def send_notification(sender, instance, created, **kwargs):
    print("Signal triggered")
    print(instance)
    if created:
        print("Signal",instance.user.id)
        channel_layer = get_channel_layer()
        notification_obj = Notification.objects.filter(is_seen=False, user=instance.user)
        notification_count = notification_obj.count()
        print(notification_count)
        conversation_name = None
        for i in notification_obj:
            conversation_name = i.message.conversation
            print(i.message.conversation) 
        username = instance.user.username
        data = {
            'count': notification_count
        }

        async_to_sync(channel_layer.group_send)(
            username, {
                'type': 'send_notification',
                'value': json.dumps(data)
            }
        )
        message_object = Message.objects.filter(conversation=conversation_name,is_seen = False).exclude(sender=instance.user)
        
        messge_notification_count={'message_useen_count': message_object.count()}
        async_to_sync(channel_layer.group_send)(
             f"messages_{conversation_name}", {
                'type': 'send_messge_notification_count',
                'value': json.dumps(messge_notification_count)
            }
        )
    else:
        print("Signal",instance.user.id)
        channel_layer = get_channel_layer()
        notification_obj = Notification.objects.filter(is_seen=False, user=instance.user)
        notification_count = notification_obj.count()
        print(notification_count)
        conversation_name = None
        for i in notification_obj:
            conversation_name = i.message.conversation    
        username = instance.user.username
        data = {
            'count': notification_count
        }
        print(data)
        message_object = Message.objects.filter(conversation=conversation_name,is_seen = False).exclude(sender=instance.user)
        messge_notification_count={'message_useen_count': message_object.count()}
        print(messge_notification_count)
        async_to_sync(channel_layer.group_send)(
            f"messages_{conversation_name}", {
                'type': 'send_messge_notification_count',
                'value': json.dumps(messge_notification_count)
            }
        )
        async_to_sync(channel_layer.group_send)(
            username, {
                'type': 'send_notification',
                'value': json.dumps(data)
            }
        )
        