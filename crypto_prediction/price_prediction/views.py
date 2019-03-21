from django.shortcuts import render
import datetime
from django.utils.timezone import utc
from price_prediction.models import User, Coin, GeneratedPortfolio
from price_prediction.serializer import UserSerializer, CoinSerializer, GeneratedPortfolioSerializer
from rest_framework import generics

# Create your views here.
class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CoinList(generics.ListAPIView):
    queryset = Coin.objects.all()
    serializer_class = CoinSerializer

class GeneratedPortfolioList(generics.ListAPIView):
    serializer_class = GeneratedPortfolioSerializer
    def get_queryset(self):
        username = self.kwargs['username']
        print(username)
        now = datetime.datetime.utcnow().replace(tzinfo=utc)
        if username is not None:
            return GeneratedPortfolio.objects.filter(associated_username=username, valid_until_date_time__gt=now)
        else: 
            return list()

class GeneratedPortfolioList(generics.ListAPIView):
    serializer_class = GeneratedPortfolioSerializer
    def get_queryset(self):
        username = self.kwargs['username']
        print(username)
        now = datetime.datetime.utcnow().replace(tzinfo=utc)
        if username is not None:
            return GeneratedPortfolio.objects.filter(associated_username=username, valid_until_date_time__gt=now)
        else: 
            return list()

class ActiveGeneratedPortfolioList(generics.ListAPIView):
    serializer_class = GeneratedPortfolioSerializer
    def get_queryset(self):
        username = self.kwargs['username']
        print(username)
        now = datetime.datetime.utcnow().replace(tzinfo=utc)
        if username is not None:
            return GeneratedPortfolio.objects.filter(associated_username=username, valid_until_date_time__gt=now)
        else: 
            return list()


