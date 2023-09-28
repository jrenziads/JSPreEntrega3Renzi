//Para tercer pre entrega. Carrito de venta de accesorios Toyota
// me traigo lo que necesito del html con dom.
const cards = document.getElementById("cards");
const templateCard = document.getElementById("template-card").content;
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    pintarCarrito();
  }
});

cards.addEventListener("click", (e) => {
  addCarrito(e);
});

items.addEventListener("click", (e) => {
  btnAccion(e);
});

const fetchData = async () => {
  try {
    const res = await fetch("vehiculos.json");
    const data = await res.json();
    pintarCard(data);
  } catch (error) {
    console.log(error);
  }
};

const pintarCard = (data) => {
  data.forEach((item) => {
    const { title, precio, thumbnailUrl, id } = item;
    templateCard.querySelector("h5").textContent = title;
    templateCard.querySelector("p").textContent = precio;
    templateCard.querySelector("img").setAttribute("src", thumbnailUrl);
    templateCard.querySelector(".btn-dark").dataset.id = id;
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

const addCarrito = (e) => {
  //console.log(e.target)
  //console.log(e.target.classList.contains('btn-dark'))
  if (e.target.classList.contains("btn-dark")) {
    setCarrito(e.target.parentElement);
  }

  e.stopPropagation();
};

const setCarrito = (item) => {
  //console.log(objeto)
  const producto = {
    title: item.querySelector("h5").textContent,
    precio: item.querySelector("p").textContent,
    id: item.querySelector(".btn-dark").dataset.id,
    cantidad: 1,
  };

  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }

  carrito[producto.id] = { ...producto };
  pintarCarrito();
};

const pintarCarrito = () => {
  items.innerHTML = "";
  Object.values(carrito).forEach((producto) => {
    const { id, title, cantidad, precio } = producto;
    templateCarrito.querySelector("th").textContent = id;
    templateCarrito.querySelectorAll("td")[0].textContent = title;
    templateCarrito.querySelectorAll("td")[1].textContent = cantidad;
    templateCarrito.querySelector(".btn-info").dataset.id = id;
    templateCarrito.querySelector(".btn-danger").dataset.id = id;
    templateCarrito.querySelector("span").textContent = cantidad * precio;
    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  });

  items.appendChild(fragment);

  pintarFooter();

  localStorage.setItem("carrito", JSON.stringify(carrito));
};

const pintarFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `
			<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
			`;
    return;
  }

  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const nPrecio = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
  templateFooter.querySelector("span").textContent = nPrecio;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const btnVaciar = document.getElementById("vaciar-carrito");
  btnVaciar.addEventListener("click", () => {
    carrito = {};
    pintarCarrito();
  });
};

const btnAccion = (e) => {
  if (e.target.classList.contains("btn-info")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad++;

    carrito[e.target.dataset.id] = { ...producto };
    pintarCarrito();
  }

  if (e.target.classList.contains("btn-danger")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad--;
    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    }
    pintarCarrito();
  }

  e.stopPropagation();
};
