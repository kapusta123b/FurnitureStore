from django.contrib.auth import get_user_model
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.core.mail import send_mail
from django.conf import settings

User = get_user_model()

@receiver(post_save, sender=User)
def user_postsave(sender, instance, created, **kwargs):
    if created:
        subject = 'Welcome to Furniture Store – Your Account is Ready!'
        from_email = settings.EMAIL_HOST_USER
        to_email = instance.email
        
        plain_message = f'''
Welcome to Furniture Store!

Hello {instance.first_name or instance.username},

Thank you for creating an account with us! We're excited to have you join our community.

Your account is now active. Start exploring our furniture collection and enjoy a premium shopping experience.

What's Next?
• Browse our latest furniture collections
• Add items to your favorites
• Track your orders in real-time
• Subscribe to our newsletter for exclusive deals

If you have any questions, feel free to reach out to us at:
Phone: (928) 630-9272
Email: fStore@email.com

Best regards,
The Furniture Store Team

© 2025 Furniture Store. All rights reserved.
'''
        
        html_message = f'''
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
            </head>
            <body style="font-family: 'DM Sans', sans-serif; background-color: #f6f4f2; padding: 20px; margin: 0;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                    
                    <div style="background-color: #947458; padding: 50px 40px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">Welcome to<br>Furniture Store</h1>
                    </div>
                    
                    <div style="padding: 50px 40px; background-color: #ffffff;">
                        <p style="font-size: 16px; color: #000000; margin: 0 0 25px 0; font-weight: 500;">
                            Hello <strong>{instance.first_name or instance.username}</strong>,
                        </p>
                        
                        <p style="font-size: 15px; color: #282725; line-height: 1.8; margin: 0 0 20px 0;">
                            Thank you for creating an account with us! We're excited to have you join our community.
                        </p>
                        
                        <p style="font-size: 15px; color: #282725; line-height: 1.8; margin: 0 0 30px 0;">
                            Your account is now active. Start exploring our premium furniture collection and enjoy a seamless shopping experience tailored just for you.
                        </p>
                        
                        <div style="background-color: #f6f4f2; padding: 25px; border-left: 4px solid #947458; margin: 30px 0; border-radius: 2px;">
                            <p style="margin: 0; color: #000000; font-size: 15px; font-weight: 600; margin-bottom: 12px;">
                                What's Next?
                            </p>
                            <ul style="margin: 0; padding-left: 20px; color: #282725; font-size: 14px; line-height: 1.8;">
                                <li>Browse our latest furniture collections</li>
                                <li>Add items to your favorites</li>
                                <li>Track your orders in real-time</li>
                                <li>Subscribe to our newsletter for exclusive deals</li>
                            </ul>
                        </div>
                        
                        <p style="font-size: 14px; color: #282725; line-height: 1.8; margin: 30px 0;">
                            If you have any questions, feel free to reach out to us:
                        </p>
                        
                        <div style="background-color: #f6f4f2; padding: 20px; margin: 0 0 30px 0; border-radius: 2px; text-align: center;">
                            <p style="margin: 0 0 8px 0; color: #000000; font-size: 14px;">
                                <strong>Phone:</strong> (928) 630-9272
                            </p>
                            <p style="margin: 0; color: #000000; font-size: 14px;">
                                <strong>Email:</strong> furniturestorecompany@gmail.com
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="http://127.0.0.1:8000/catalog/all/" style="display: inline-block; background-color: #947458; color: white; text-decoration: none; padding: 14px 40px; border-radius: 0; font-weight: 600; font-size: 15px; letter-spacing: 0.5px;">
                                START SHOPPING
                            </a>
                        </div>
                    </div>
                    
                    <div style="background-color: #f6f4f2; padding: 30px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
                        <p style="margin: 0 0 12px 0; color: #282725; font-size: 13px; line-height: 1.6;">
                            © 2025 Furniture Store. All rights reserved.
                        </p>
                        <p style="margin: 0; color: #999999; font-size: 12px;">
                            <a href="#" style="color: #947458; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
                            <a href="#" style="color: #947458; text-decoration: none; margin: 0 10px;">Contact Us</a> | 
                            <a href="#" style="color: #947458; text-decoration: none; margin: 0 10px;">Unsubscribe</a>
                        </p>
                    </div>
                </div>
            </body>
        </html>
        '''
        
        send_mail(
            subject,
            plain_message,
            from_email,
            [to_email],
            html_message=html_message,
            fail_silently=False,
        )

