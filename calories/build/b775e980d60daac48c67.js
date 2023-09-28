import '../index.html';
import '../assets/styles/index.css';
import { addProductToContainer } from './helpers';
const todayProductsContainer = document.getElementById('todayProducts');
const products = [{
  id: 0,
  name: 'Хлеб',
  weight: 200,
  calories: 78
}, {
  id: 1,
  name: 'Рис',
  weight: 150,
  calories: 110
}];
products.map(el => addProductToContainer(el, todayProductsContainer));