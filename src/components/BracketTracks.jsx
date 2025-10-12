import {Text, VStack, Box} from "@chakra-ui/react";
import {useState, useMemo, useEffect} from "react";
import axios from "axios";
import {debounce} from "throttle-debounce";
import image from '../assets/bracket.png';


const Bracket = ({username, mode, timeframe, bgcolor, bracketcolor, textcolor}) => {
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
    const [topTracks, setTopTracks] = useState([]);

	const returnTopTracks = useMemo(
		() =>
			debounce(500, (e, t) => {
				{mode == "artist" ? (
					axios.get(`
						https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${e.split(' ').join('+').replace('&',"and")}&api_key=38453222bd8526be0f30d941903e739f&format=json&limit=64`)
					.then(
						response => setTopTracks(response.data.toptracks.track)
					)
				) : (		
					axios.get(`
						https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${e}&period=${t}&api_key=38453222bd8526be0f30d941903e739f&format=json&limit=64`)
					.then(
						response => setTopTracks(response.data.toptracks.track)
					)
				)}
			}),
		[mode]	
	)

	useEffect(() => {
		if (username) {
			setTopTracks([]);
			returnTopTracks(username, timeframe);
		}
	}, [username, mode, timeframe]);

	if (topTracks.length <= 1) {
		return (null);
	} else if (topTracks.length < 64) {
		return (<Text>not enough tracks</Text>);
	} else {
		return (
			<Box
				position="relative"
				width={1257}
				height="auto"
				display="inline-block">
				<Box
					position="absolute" //BACKGROUND LAYER
					width="100%"
					height="100%"
					bg={bgcolor.toString('hexa')}
					zIndex={1}
					pointerEvents="none"
	
					WebkitMaskImage={`url(${image})`} //Utilize mask to create background coloring for bracket
					WebkitMaskRepeat="no-repeat"
					WebkitMaskPosition="center"
					WebkitMaskComposite="destination-in"
					WebkitMaskSize="100% 100%"
					WebkitMaskImageRendering="pixelated"
					WebkitMaskMode="luminance"
					
					maskImage={`url(${image})`}
					maskSize="100% 100%"
					maskRepeat="no-repeat"
					maskPosition="center"
					maskMode="luminance"
					maskComposite="intersect"
				>
				</Box>
	
				<Box
				position="absolute" //BRACKET LAYER
				width="100%"
				height="100%"
				zIndex={0}
				pointerEvents="none"
				bg={bracketcolor.toString('hexa')} //Colors the TRANSPARENT BRACKET SHAPE inside the image using the masked background
				>
				</Box>
	
				<VStack
				alignItems="flex-start" //TEXT/OTHER LAYER
				width="100%"
				p="10px"
				color={textcolor.toString('hexa')} //Colors TEXT PLACED OVER IMAGE (not affected)
				position="relative"
				zIndex={2}
				>
					{bracket_seed_order.map((seed, index) => {
						const track = topTracks[seed - 1];
						return (
						<Text key={index} fontSize={'xs'}>
							<Text as={'b'}>{seed}</Text> {track.artist.name} - {track.name || "loading..."}
						</Text>
						);
					})}
				</VStack>
			</Box>
		)
	}
}

export { Bracket }