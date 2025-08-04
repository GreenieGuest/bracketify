const textbox = document.getElementById("input");
const div = document.getElementById("output");
const apiKey = "38453222bd8526be0f30d941903e739f"

const bracket_seed_order = [
    1, 64, 32, 33, 17, 48, 16, 49,
    9, 56, 24, 41, 25, 40, 8, 57,
    5, 60, 28, 37, 21, 44, 12, 53,
    13, 52, 20, 45, 4, 61, 29, 36,
    3, 62, 30, 35, 19, 46, 14, 51,
    11, 54, 22, 43, 27, 38, 6, 59,
    7, 58, 26, 39, 23, 42, 10, 55,
    15, 50, 18, 47, 31, 34, 2, 63
]

const colors = [
    "crimson", "crimson", "red", "red", "crimson", "crimson", "red", "red",
    "crimson", "crimson", "red", "red", "crimson", "crimson", "red", "red",
    "crimson", "crimson", "red", "red", "crimson", "crimson", "red", "red",
    "crimson", "crimson", "red", "red", "crimson", "crimson", "red", "red",
    "crimson", "crimson", "red", "red", "crimson", "crimson", "red", "red",
    "crimson", "crimson", "red", "red", "crimson", "crimson", "red", "red",
    "crimson", "crimson", "red", "red", "crimson", "crimson", "red", "red",
    "crimson", "crimson", "red", "red", "crimson", "crimson", "red", "red" // this looks redundant but ill probably add more variety later
]

async function getTopArtists(username) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${apiKey}&format=json&limit=64`;
    try {
        const response = await fetch(url);
        const data = await response.json();
		const artists = data.topartists.artist;
		
		if (artists && artists.length >= 64) {
			clearText()
			for (var i = 0; i < 64; i++) {
				let seed = bracket_seed_order[i];
				let topTrack = await getTopArtistSong(artists[seed - 1].name);
				console.log(topTrack);
				displaySeed(seed, `${artists[seed - 1].name} - ${topTrack}`, colors[i]);
				if ((i + 1) % 2 == 0) {
					const hr = document.createElement("hr");
					div.appendChild(hr);
				}
			}
		} else {
			clearText()
			displayText("Sorry, this account hasn't listened to enough artists to create a Bracketify.")
		}
        //console.log(data.topartists.artist); // Accessing track data
		
		//clearText()
		//data.topartists.artist.forEach((artist, index) => {
		//	displayText(`${index + 1}: ${artist.name}`);
		//});
    } catch (error) {
        console.error("Error fetching data:", error);
		clearText();
		displayText("Invalid profile");
    }
}

async function getTopArtistSong(artistName) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getTopTracks&artist=${artistName}&api_key=${apiKey}&format=json&limit=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
		const tracks = data.toptracks.track;
		
		var trackName;
		
		if (tracks) {
			trackName = tracks[0].name;
		}
        //console.log(data.topartists.artist); // Accessing track data
		
		//clearText()
		//data.topartists.artist.forEach((artist, index) => {
		//	displayText(`${index + 1}: ${artist.name}`);
		//});
		return trackName
    } catch (error) {
        console.error("Error fetching data:", error);
		clearText();
		displayText("Invalid profile");
    }
}

function clearText() {
	div.innerHTML = "";
}

function displayText(str) {
	const p = document.createElement("p");
	p.innerHTML = str;
	
	div.appendChild(p);
}

function displaySeed(seed, str, color) {
	const p = document.createElement("p");
	p.innerHTML = `<span style="color: white; font-weight: bold; font-style: normal;">${seed} //</span> <span style="color: ${color};">${str}</span>`;
	
	div.appendChild(p);
}

function loadItUp() {
	username = textbox.value;
	getTopArtists(username); 
}

document.getElementById("proceed").addEventListener("click", loadItUp);