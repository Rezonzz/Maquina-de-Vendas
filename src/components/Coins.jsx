import { toast } from 'react-toastify';
import { logAndStore } from './log';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Coin = ({ setTotalCoins, setCoinList, coinsBox, setCoinsBox}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Função assíncrona para obter os dados do moedeiro da API
    const fetchCoinsBox = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7280/Coins/GetCoinsBox"
        );
        setIsLoading(false);
        setCoinsBox(response.data);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchCoinsBox();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="loading-pane">
        <h2 className="loader">🧃</h2>
      </div>
    );
  }

  const getCurrentTime = () => {
    const date = new Date();
    const options = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    return `${date.toLocaleDateString('pt-PT', options)}`;
  }; 

  const handleCoinClick = (value) => {
    setTotalCoins((prevTotalCoins) => prevTotalCoins + value);
    setCoinList((prevCoinList) => [...prevCoinList, value]);

    if(value < 100){
      toast.info(`Introduziu a moeda de ${value} cent!`, { autoClose: 1500 });
      logAndStore(`Introduziu uma moeda de ${value} cent - ${getCurrentTime()}`);
    } else {
      toast.info(`Introduziu a moeda de ${value / 100} EUR!`, { autoClose: 1500 });
      logAndStore(`Introduziu uma moeda de ${value / 100} EUR - ${getCurrentTime()}`);
    }
  };

  return (
    <div className="coinbox">
      <div className="title">
        <h2>Introduza moedas</h2>
      </div>
      <div className="moedas">
        {coinsBox.sort((a, b) => a.moeda - b.moeda).map((coin) => {
          if(coin.moeda >= 100) {
            return (
              <button key={coin.id} onClick={() => handleCoinClick(coin.moeda)}>{coin.moeda / 100} EUR</button>
            )
          } else {
            return (
              <button key={coin.id} onClick={() => handleCoinClick(coin.moeda)}>{coin.moeda} cent</button>
            )
          }
          
          })}
      </div>
    </div>
  );
};

export default Coin;
