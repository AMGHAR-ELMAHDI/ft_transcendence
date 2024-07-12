from django.core.exceptions import ValidationError

def max_size_validator(file):
	max_size_mb = 2
	if (file.size > max_size_mb * 10**6):
		raise ValidationError(f"File can not be larger that {max_size_mb}MB!")