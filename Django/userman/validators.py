from django.core.exceptions import ValidationError
from django.contrib.auth.validators import ASCIIUsernameValidator
from django.core.validators import RegexValidator


def max_size_validator(file):
    max_size_mb = 2
    if (file.size > max_size_mb * 10**6):
        raise ValidationError(f"File can not be larger that {max_size_mb}MB!")
    

# Define validators
username_validator = ASCIIUsernameValidator()
char_validator = RegexValidator(r'^[a-zA-Z]*$', 'Only alphabetical characters are allowed.')
email_validator = RegexValidator(
    r'^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-_]+\.[a-z]{2,}$',
    'Enter a valid email address.'
)