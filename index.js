const API_URL = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2309-FTB-ET-WEB-PT/events";

let state = {
    parties: []
}

const partyList = document.querySelector('#partyList');
const addPartyForm = document.querySelector('#addParty');
addPartyForm.addEventListener("submit", addParty);

async function getAndRender() {
    await getParties();
    renderParties();
  }
  getAndRender();

async function getParties() {
    // TODO
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      state.parties = json.data;
    } catch (error) {
      console.error(error);
    }
}

async function addParty(event) {
    event.preventDefault();
  
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({  name: addPartyForm.elements["name"].value,
          description: addPartyForm.elements["description"].value,
          date: `${addPartyForm.elements["date"].value}T${addPartyForm.elements["time"].value}:00.000Z`,
            location: addPartyForm.elements["location"].value
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create party");
      }
  
      getAndRender();
    } catch (error) {
      console.error(error);
    }
}

async function deleteParty(partyId) {
    try {
        const response = await fetch(`${API_URL}/${partyId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Party could not be deleted.');
        }
    
        getAndRender();
      } catch (error) {
        console.log(error);
      }
}

function renderParties() {
    if (!state.parties.length) {
        partyList.innerHTML = "<li>No parties here!</li>";
    } else {
        const partyCards = state.parties.map((party) => {
            const card = document.createElement("li");
            const cleanDate = party.date.slice(0,10);
            let cleanTime = party.date.slice(11,16);
            if ((cleanTime.slice(0,2) * 1) >= 13){
                cleanTime = `${(cleanTime.slice(0,2)*1)-12}${cleanTime.slice(2,5)} PM`;
            } else {
                cleanTime = `${cleanTime} AM`;
            }
            card.innerHTML = `
            <h2>${party.name}</h2>
            <p>${cleanDate}</p>
            <p>${cleanTime}</p>
            <p>${party.location}</p>
            <p>${party.description}</p>
            `;

            const deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete Party";
            card.append(deleteButton);
            deleteButton.addEventListener('click', () => {deleteParty(party.id)});
            return card;
        })
        partyList.replaceChildren(...partyCards);
    }
}
