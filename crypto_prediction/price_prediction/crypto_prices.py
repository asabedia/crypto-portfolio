import pandas as pd
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
def getTodaysPricesFor(coinList):
    for coin in coinList:
        print(coin)
        dataframe = pd.read_html("https://coinmarketcap.com/currencies/" + coin + "/", flavor='html5lib')[0]
        print(dataframe)

getTodaysPricesFor(list(["bitcoin"]))