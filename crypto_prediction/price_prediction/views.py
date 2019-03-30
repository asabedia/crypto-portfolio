from django.shortcuts import render
import datetime
from django.utils.timezone import utc
from price_prediction.models import User, Coin, GeneratedPortfolio, Coin_in_Generated_Portfolio, Coin_in_User_Portfolio
from price_prediction.serializer import UserSerializer, CoinSerializer, GeneratedPortfolioSerializer, CoinInGeneratedPortfolioSerializer, CoinInUserPortfolioSerializer
from rest_framework import generics
from django.views import View
import json
from .rnn_model import predict
from .crypto_prices import get_todays_prices
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
    def post(self, request, *args, **kwargs):
        req = json.loads(request.body)
        print(req)
        portfolio_id = req['portfolio_id']
        items = req['items']
        gport =  GeneratedPortfolio.objects.filter(pk=portfolio_id)
        for item in items:
            coin = Coin.objects.filter(pk=item['coin'])
            Coin_in_Generated_Portfolio(portfolio_id=gport[0], coin_id = coin[0], amount_purchased=item['amount_purchased'], predicted_price=item['predicted_price']).save()
        return HttpResponse(json.dumps(req))


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
        print(req)
        username = req['username']
        print(req)
        B = User.objects.values_list('budget', flat = True).get(username=username)

        p = { i['coin'] : float(i['price']) for i in req['predicted_price'] }

        x = []
        f = {}
        y = {}
        for i in req['current_portfolio']['items']:
            x.append(i['coin'])
            f[i['coin']] = float(i['max_amount'])
            y[i['coin']] = float(i['amount_purchased'])
        c = get_todays_prices(x) # cost of the coin today        
        print(x)
        print(c)
        print(p)
        print(y)
        print(f)
        print(B)
        solution = get_optimal_quantities(y, x, c, p, B, f)
        print(solution)
        return HttpResponse(json.dumps(solution))
