from datetime import timedelta
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from app.models.admin_account import AdminAccount
from app.core.admin_access import verify_password
from app.core.security import create_access_token, decode_access_token
from app.services.otp_service import create_otp, verify_otp, OTPStatus, OTPCooldownException
from app.services.sms_service import send_sms_otp


def login(request, db):
    account = db.query(AdminAccount).filter(AdminAccount.username == request.username).first()
    if not account or not account.is_active or not verify_password(request.password, account.password_hash):
        raise HTTPException(401, "Invalid username or password")
    try:
        code = create_otp(db, account.phone_number)
        send_sms_otp(account.phone_number, code)
        db.commit()
    except OTPCooldownException as exc:
        db.rollback()
        return JSONResponse(status_code=429, content={"detail": "Please wait before requesting another OTP", "retry_after": exc.retry_after})
    except Exception:
        db.rollback()
        raise HTTPException(500, "Failed to send admin OTP")
    challenge = create_access_token(account.username, timedelta(minutes=5), "admin_login", {"version": account.token_version})
    return {"message": "OTP sent", "phone_masked": f"******{account.phone_number[-4:]}", "challenge": challenge}


def verify(request, db):
    payload = decode_access_token(request.challenge)
    account = db.query(AdminAccount).filter(AdminAccount.username == request.username).first()
    if not payload or payload.get("type") != "admin_login" or payload.get("sub") != request.username or not account or not account.is_active or payload.get("version") != account.token_version:
        raise HTTPException(401, "Please enter your username and password again")
    if verify_otp(db, account.phone_number, request.otp) != OTPStatus.VALID:
        raise HTTPException(400, "Invalid, expired or already used OTP. Please try again or request a new code.")
    token = create_access_token(account.username, token_type="admin_access", extra_claims={"version": account.token_version})
    return {"access_token": token, "token_type": "bearer", "role": "admin"}
