from django.shortcuts import render
import datetime
from django.utils.timezone import utc
from price_prediction.models import User, Coin, GeneratedPortfolio, Coin_in_Generated_Portfolio, Coin_in_User_Portfolio
from price_prediction.serializer import UserSerializer, CoinSerializer, GeneratedPortfolioSerializer, CoinInGeneratedPortfolioSerializer, CoinInUserPortfolioSerializer
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

class CoinsForGeneratedPortoflio(generics.ListAPIView):
    serializer_class = CoinInGeneratedPortfolioSerializer
    def get_queryset(self):
        portfolio = self.kwargs['portfolio']
        print(portfolio)
        if portfolio is not None:
            return Coin_in_Generated_Portfolio.objects.filter(portfolio_id=portfolio)
        else:
            return list()

class CoinsForUserPortoflio(generics.ListAPIView):
    serializer_class = CoinInUserPortfolioSerializer
    def get_queryset(self):
        portfolio = self.kwargs['portfolio']
        print(portfolio)
        if portfolio is not None:
            return Coin_in_User_Portfolio.objects.filter(portfolio_id=portfolio)
        else:
            return list()

class CreateUser(generics.CreateAPIView):
    serializer_class = UserSerializer

class CreateGeneratedPortfolio(generics.CreateAPIView):
    serializer_class = GeneratedPortfolioSerializer

class CreateCoinsInGeneratedPortoflio(generics.CreateAPIView):
    serializer_class = CoinInGeneratedPortfolioSerializer

class CreateCoinsInUserPortoflio(generics.CreateAPIView):
    serializer_class = CoinInUserPortfolioSerializer

