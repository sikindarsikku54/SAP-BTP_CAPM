async function fetchDistricts() {

  const state = document.getElementById("stateInput").value;

  const res = await fetch(`/odata/v4/location/getDistricts?state=${state}`);
  const data = await res.json();

  const container = document.getElementById("cards");
  container.innerHTML = "";

  data.value.forEach(d => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${d.name}</h3>`;
    container.appendChild(card);
  });

}