from django.shortcuts import render
import datetime
from django.utils.timezone import utc
from price_prediction.models import User, Coin, GeneratedPortfolio, Coin_in_Generated_Portfolio, Coin_in_User_Portfolio
from price_prediction.serializer import UserSerializer, CoinSerializer, GeneratedPortfolioSerializer, CoinInGeneratedPortfolioSerializer, CoinInUserPortfolioSerializer
from rest_framework import generics
from django.views import View
import json
from .rnn_model import predict
from .LP_test import get_optimal_quantities
from django.http import HttpResponse

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

class GetCoinPrediciton (generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        coins = json.loads(request.body)
        predictions = {}
        print(coins)
        for coin in coins:
            predictions[coin] = predict(coin)
        return HttpResponse(json.dumps(predictions))

class GetGeneratedPortfolio (generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        req = json.loads(request.body)
        B = User.objects.values_list('budget', flat = True).get(username=username)

        p = { i['coin'] : float(i['price']) for i in req['tomorrows_predicted_prices'] }

        x = []
        c = {} # cost of the coin today
        f = {}
        y = {}
        for i in req['current_portfolio']['items']:
            x.append(i['coin'])
            f[i['coin']] = float(i['max_amount'])
            y[i['coin']] = float(i['amount_purchased'])
        
        print(get_optimal_quantities(y, x, c, p, B, f))
        return HttpResponse(json.dumps(req))
