import defaultDrinks from "./defaultDrinks";
import Drink from "./Drink";
import { logAndStore } from "./log";
import { useEffect, useState } from "react";
import axios from "axios";

const Machine = ({ setSelectedDrink, selectedDrink, totalCoins }) => {

  const getCurrentTime = () => {
    const date = new Date();
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return `${date.toLocaleDateString("pt-PT", options)}`;
  };

  const [drinks, setDrinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Função assíncrona para obter os dados do moedeiro da API
    const fetchDrinks = async () => {
      try {
        const response = await axios.get('https://localhost:7280/Drinks/GetDrinks');
        if (response.data.length <= 0) {
          defaultDrinks.forEach(async (drink) => {
            try {
              await axios.post("https://localhost:7280/Drinks/PostDrinks", drink);
              console.log('Enviado:', JSON.stringify(drink));
            } catch (error) {
              console.error('Erro ao enviar:', JSON.stringify(drink));
              console.error(error);
            }
          });
        }
        setIsLoading(false);
        setDrinks(response.data || defaultDrinks);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    };
  
    // Chamar a função para obter os dados do moedeiro ao montar o componente
    fetchDrinks();
  }, []);

  useEffect(() => {
    if (selectedDrink === null) {
      drinks.forEach((d) => {
        if (totalCoins / 100 < d.price) {
          document.getElementById(d.name).style.backgroundColor = "#757575";
        } else {
          if (d.quant === 0) {
            document.getElementById(d.name).style.backgroundColor = "#757575";
          } else {
            document.getElementById(d.name).style.backgroundColor = "#222222";
          }
        }
        document.getElementById(d.name).removeAttribute("data-selected");
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDrink]);

  if (isLoading) {
    return (
      <div className="loading-pane">
        <h2 className="loader">🧃</h2>
      </div>
    );
  }

  let timeoutId;

  const handleDrinkClick = (drink) => {
    clearTimeout(timeoutId);
    setSelectedDrink(drink);
    logAndStore(`Selecionou a bebida ${drink.name} - ${getCurrentTime()}`);

    timeoutId = setTimeout(() => {
      drinks.forEach((d) => {
        if (totalCoins / 100 < d.price) {
          document.getElementById(d.name).style.backgroundColor = "#757575";
        } else {
          document.getElementById(d.name).style.backgroundColor = "#222222";
        }
        document.getElementById(d.name).removeAttribute("data-selected");
      });
      setSelectedDrink(null);
    }, 15000);
  };

  return (
    <div className="bebidas">
      {drinks.map((drink) => (
        <Drink
          key={drink.name}
          drink={drink}
          onClick={handleDrinkClick}
          selectedDrink={selectedDrink}
          totalCoins={totalCoins}
        />
      ))}
    </div>
  );
};

export default Machine;
