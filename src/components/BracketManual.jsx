import {Text, VStack} from "@chakra-ui/react";
import {useMemo} from "react";
import image from '../assets/bracket.png';


const ManualBracket = ({tracks, bgcolor, textcolor}) => {
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

	const tracksSortedByListeners = useMemo(() => {
  		if (!Array.isArray(tracks)) return [];
		return tracks
			.map(song => ({
				...song,
				listeners: parseInt(song.listeners) || 0
			}))
				.sort((a, b) => b.listeners - a.listeners);
	}, [tracks]);

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
				const track = tracksSortedByListeners[seed - 1];
				if (!track.title) {
					return (
					<Text key={index} fontSize={'xs'}>
						<Text as={'b'}>{seed}</Text> {" "}
					</Text>
					);
				}

				return (
				<Text key={index} fontSize={'xs'}>
					<Text as={'b'}>{seed}</Text> {track.artist} - {track.name || "loading..."}
				</Text>
				);
			})}
		</VStack>
	)
}

export { ManualBracket }