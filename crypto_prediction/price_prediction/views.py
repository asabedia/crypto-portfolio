from django.shortcuts import render
from price_prediction.models import User
from price_prediction.serializer import UserSerializer
from rest_framework import generics

# Create your views here.
class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
