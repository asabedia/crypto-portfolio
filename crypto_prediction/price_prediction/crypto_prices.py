import pandas as pd
import ssl
import time

ssl._create_default_https_context = ssl._create_unverified_context
def getTodaysPricesFor(coinList):
    for coin in coinList:
        print(coin)
        dataframe = pd.read_html("https://coinmarketcap.com/currencies/" + coin + "/", flavor='html5lib')[0]
        print(dataframe)

# getTodaysPricesFor(["bitcoin"])

def get_tomorrow_price (coin):
    #   Method to download data
    dataframe = pd.read_html("https://coinmarketcap.com/currencies/" + coin +
                             "/historical-data/?start="+time.strftime("%Y%m%d")+"&end="+time.strftime("%Y%m%d"), flavor='html5lib')[0]
    dataframe.columns = ["Date","Open","High","Low","Close","Volume","Market_Cap"]
    return dataframe['Close'][0]

print(get_tomorrow_price('bitcoin'))