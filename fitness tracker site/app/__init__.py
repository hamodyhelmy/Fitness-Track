import os
from dotenv import load_dotenv
from flask import Flask
from flask_mail import Mail

mail = Mail()


def create_app():
    app = Flask(__name__)
    
    # Load environment variables from .env file
    load_dotenv()

    # Replace with a secure, random string
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default_secret_key')

    # Flask-Mail configuration
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
    app.config['MAIL_PORT'] = int(
        os.getenv(
            'MAIL_PORT',
            587))  # Default to 587
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS') == 'True'
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

    if not all([app.config['MAIL_SERVER'],
               app.config['MAIL_USERNAME'], app.config['MAIL_PASSWORD']]):
        raise ValueError("Missing one or more Flask-Mail configurations.")

    mail.init_app(app)

    # Register routes
    with app.app_context():
        from .routes import bp
        app.register_blueprint(bp, url_prefix='/')

    return app
