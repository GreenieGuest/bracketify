import {Text, VStack} from "@chakra-ui/react";
import {useState, useMemo, useEffect} from "react";
import axios from "axios";
import {debounce} from "throttle-debounce";
import image from '../assets/bracket.png';


const Bracket = ({username, bgcolor, textcolor}) => {
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
    const [albumURL, setAlbumURL] = useState("");
    const [topArtists, setTopArtists] = useState([]);

	const returnTopArtists = useMemo(
		() =>
			debounce(500, (e) => {
				axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${e}&api_key=38453222bd8526be0f30d941903e739f&format=json&limit=64`)
				.then(response => setTopArtists(response.data.topartists.artist))
			}),
		[]	
	)

	useEffect(() => {
		if (username) {
			returnTopArtists(username);
		}
	}, [username]);

	if (!topArtists || topArtists.length < 64) {
		return (<Text>invalid profile or not enough artists</Text>);
    } else {
		return (
			<VStack
				alignItems="flex-start"
				width={1257}
				p="10px"
				bg={bgcolor.toString('hexa')}
				color={textcolor.toString('hexa')}
				bgImage={`url(${image})`}
				bgSize='cover'
				bgRepeat="no-repeat"
			>
				{bracket_seed_order.map((seed, index) => {
					const artist = topArtists[seed - 1];
					return (
					<Text key={index} fontSize={'xs'}>
						<Text as={'b'}>{seed}</Text> {artist.name}
					</Text>
					)
				})}
			</VStack>
		)
	}
}

export { Bracket }