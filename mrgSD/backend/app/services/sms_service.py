from app.core.config import settings

def send_sms_otp(phone_number: str, otp: str) -> bool:
    """
    Mock SMS delivery service for development.
    In a real environment, this would integrate with Twilio, AWS SNS, Msg91, etc.
    """
    if settings.ENVIRONMENT != "production":
        print(f"\n[DEV SMS] OTP for {phone_number}: {otp}\n")
    return True
