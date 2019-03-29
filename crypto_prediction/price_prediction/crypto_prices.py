import pandas as pd
import ssl
import time



def get_todays_prices (coinList):
    ssl._create_default_https_context = ssl._create_unverified_context
    #   Method to download data
    prices = {}
    print(coinList)
    for coin in coinList:
        print(coin)
        print(time.localtime())
        start_date = str(int(time.strftime("%Y%m%d"))-1)
        end_date = time.strftime("%Y%m%d")
        print("start: " + start_date)
        print("end: " + end_date)
        dataframe = pd.read_html("https://coinmarketcap.com/currencies/" + coin +
                                "/historical-data/?start="+start_date+"&end="+end_date, flavor='html5lib')[0]
        dataframe.columns = ["Date","Open","High","Low","Close","Volume","Market_Cap"]
        print(dataframe)
        prices[coin] = dataframe['Open'][0]
        print(prices)
    return prices

print(get_todays_prices(['bitcoin']))

