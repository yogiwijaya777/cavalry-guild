import { register, login, logout } from './auth.js';
import { renderArchetype, renderArchetypes } from './archetypes.js';
import { renderDeck, renderDecks } from './decks.js';

// Utils
function createUuidRegex(keyword) {
  const regexString = `\\/${keyword}\\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})`;
  return new RegExp(regexString);
}
// DOM TRIGGER

// Auth
const registerForm = document.querySelector('.form--register');
const loginForm = document.querySelector('.form--login');
const logoutButton = document.querySelector('.nav__el--logout');

// Archetypes
const archetypesRoute = location.pathname === '/archetypes' || location.pathname === '/archetypes/';
const isArchetypeByIdRoute = location.pathname.match(createUuidRegex('archetypes'));

// Decks
const decksRoute = location.pathname === '/decks' || location.pathname === '/decks/';
const isDeckByIdRoute = location.pathname.match(createUuidRegex('decks'));

if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    register(name, email, password);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logoutButton) logoutButton.addEventListener('click', logout);

console.log(archetypesRoute);
console.log(location.pathname);
if (archetypesRoute) {
  const urlParams = new URLSearchParams(window.location.search);
  const queries = urlParams.toString();

  let archetypes;
  if (queries) {
    archetypes = renderArchetypes(queries);
  } else {
    archetypes = renderArchetypes();
  }

  document.addEventListener('load', archetypes);
}

if (isArchetypeByIdRoute) {
  const archetypeId = isArchetypeByIdRoute[1];

  document.addEventListener('load', renderArchetype(archetypeId));
}

if (decksRoute) {
  const urlParams = new URLSearchParams(window.location.search);
  const queries = urlParams.toString();

  let decks;
  if (queries) {
    decks = renderDecks(queries);
  } else {
    decks = renderDecks();
  }

  document.addEventListener('load', decks);
}

if (isDeckByIdRoute) {
  const deckId = isDeckByIdRoute[1];

  document.addEventListener('load', renderDeck(deckId));
}
