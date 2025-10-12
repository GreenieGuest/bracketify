import {Text, VStack, Box} from "@chakra-ui/react";
import {useMemo} from "react";
import image from '../assets/bracket.png';


const ManualBracket = ({tracks, bgcolor, seeding, bracketcolor, textcolor}) => {
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

	const seededTracks = useMemo(() => {
  		if (!Array.isArray(tracks)) return [];
		switch (seeding) {
			case "default": //"default" /= default, this is sorting by listeners
				return tracks
					.map(song => ({
						...song,
						listeners: parseInt(song.listeners) || 0 //In the case of songs having 0 listeners?
					}))
						.sort((a, b) => b.listeners - a.listeners);
			case "artist":
				return tracks
					.map(song => ({...song})).sort((a, b) => a.artist.localeCompare(b.artist));
			case "random":
				return tracks
					.map(song => ({...song})).sort(() => Math.random() - 0.5);
			default:
				return tracks //no sorting (used for in-order and manual, which is why its default)
		}
	}, [tracks, seeding]);

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
				{
				seeding == "inorder" || seeding == "artist" ? ( //In-order and artist are not based on seeding
					seededTracks.map((track, index) => {
						console.log(track.title);
						if (!track.title) {
							return (
							<Text key={index} fontSize={'xs'}>
								<Text as={'b'}>{index + 1}</Text> {" "}
							</Text>
							);
						}

						return (
						<Text key={index} fontSize={'xs'}>
							<Text as={'b'}>{index + 1}</Text> {track.artist} - {track.name || "loading..."}
						</Text>
						);
					})
				) : (
					bracket_seed_order.map((seed, index) => {
					const track = seededTracks[seed - 1];
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
					})
				)
				}
			</VStack>
		</Box>
	)
}

export { ManualBracket }