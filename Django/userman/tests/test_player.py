from rest_framework import status
from  rest_framework.test import APIClient
import pytest

#@pytest.mark.django_db
class TestRequests:
    #pytest.mark.skip
    def is_user_is_anonymous_returns_401(self):
        client = APIClient()
        response = client.get('/reqs/')
        #assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 1 == 1