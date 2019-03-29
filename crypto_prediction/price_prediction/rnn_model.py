
# coding: utf-8

# In[1]:


import gc
import datetime
import time
import pandas as pd
import numpy as np
import sklearn
import keras
import h5py
from keras import backend
from keras.models import Sequential
from keras.layers import Activation, Dense
from keras.layers import LSTM
from keras.models import model_from_json
import ssl
import os
ssl._create_default_https_context = ssl._create_unverified_context


# global variables
window = 7 # Looking at a week's worth of data to predict 1 data point
test_split = 0.2 # percentage split of training and testing/validation data                        
batch_size = 32
epochs = 10


def download_crypto (coin):
#   Method to download data
    dataframe = pd.read_html("https://coinmarketcap.com/currencies/" + coin + 
                                 "/historical-data/?start=20130428&end="+time.strftime("%Y%m%d"), flavor='html5lib')[0]
    dataframe = dataframe.assign(Date=pd.to_datetime(dataframe['Date']))  
#   Fill the null values with the mean
    dataframe['Volume'] = pd.to_numeric(dataframe['Volume'],errors='coerce')
    dataframe['Volume'].fillna(dataframe['Volume'].mean())
    dataframe.columns = ["Date","Open","High","Low","Close","Volume","Market_Cap"]
    dataframe = dataframe.drop("Date",axis=1)
    dataframe = dataframe.drop("Market_Cap",axis=1)
    dataframe = dataframe.drop("Volume",axis=1)
    return dataframe

def download_test_crypto (coin):
    #   Method to download data
    dataframe = pd.read_html("https://coinmarketcap.com/currencies/" + coin + 
                                 "/historical-data/?start="+str(int(time.strftime("%Y%m%d"))-8)+"&end="+time.strftime("%Y%m%d"), flavor='html5lib')[0]
    dataframe = dataframe.assign(Date=pd.to_datetime(dataframe['Date']))  
#   Fill the null values with the mean
    dataframe['Volume'] = pd.to_numeric(dataframe['Volume'],errors='coerce')
    dataframe['Volume'].fillna(dataframe['Volume'].mean())
    dataframe.columns = ["Date","Open","High","Low","Close","Volume","Market_Cap"]
    dataframe = dataframe.drop("Date",axis=1)
    dataframe = dataframe.drop("Market_Cap",axis=1)
    dataframe = dataframe.drop("Volume",axis=1)
    return dataframe

def create_outputs(data, coin, window=window):
#   Function produces the percentage change over a certain window 
    return (data['Close'][window:].values / data['Close'][:-window].values) - 1


def create_inputs(data, window=window):
    returnArray = []
    for i in range(len(data) - window):
        temp_set = data[i:(i + window)].copy()
        returnArray.append(temp_set)
    return returnArray

def split_data(data, training_size=test_split):
    return data[:int(training_size*len(data))], data[int(training_size*len(data)):]


def to_array(data):
    x = [np.array(data[i]) for i in range (len(data))]
    return np.array(x)


def build_model(inputs):
    model = Sequential()
    model.add(LSTM(512, return_sequences=True, input_shape=(inputs.shape[1], inputs.shape[2]), activation='relu'))
    model.add(LSTM(512, return_sequences=True, activation='relu'))
    model.add(LSTM(512, activation='relu'))
    model.add(Dense(units=1))
    model.add(Activation('tanh'))
    model.compile(loss='mse', optimizer='adam', metrics=['mae']) #mean squared error
    model.summary()
    return model

def train(coinName):
    coinset = download_crypto(coinName)
    test, train = split_data(coinset)
    X_train = create_inputs(train)
    Y_train_coin = create_outputs(train, coin=coinName)
    X_test = create_inputs(test)
    Y_test_coin = create_outputs(test, coin=coinName)
    X_train, X_test = to_array(X_train), to_array(X_test)
    coin_model = build_model(X_train)
    history = coin_model.fit(X_train, Y_train_coin, epochs=epochs, batch_size=batch_size, verbose=1, validation_data=(X_test, Y_test_coin), shuffle=False)
    model_json = coin_model.to_json()
    with open(coinName + "_model.json", "w") as json_file:
        json_file.write(model_json)
    # serialize weights to HDF5
    coin_model.save_weights(coinName + "_model.h5")

def predict(coin):
    backend.clear_session()
    json_file = open('./price_prediction/rnn_model_weights/' + coin + '_model.json', 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    model = model_from_json(loaded_model_json)
    # load weights into new model
    model.load_weights('./price_prediction/rnn_model_weights/' + coin + "_model.h5")
    model.compile(loss='mse', optimizer='adam', metrics=['mae'])
    coinset = to_array(create_inputs(download_test_crypto(coin)))[0:1] #get the latest set of datapoints
    result = model.predict(coinset)[0][0]
    return(coinset[0][0][3]-(result*coinset[0][0][3]))

#coins = ['ripple','litecoin','eos','stellar','tron','cardano','monero','iota','dash','ontology','neo','tezos','nem','zcash','vechain']
#for coin in coins:
#    train(coin)
# print(predict('bitcoin'))
