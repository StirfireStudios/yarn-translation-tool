export default function unrealWriter(results) {

	const lines = ["id, AnimPath, AudioPath"];

	results.forEach((segment) => {
		const id = segment.identifier;
		const line = [];
		line.push(id);
		line.push(`"AnimSequence'/Game/Face/${id}/Anim_Anim.Anim_Anim'"`);
		line.push(`"AnimSequence'/Game/Face/${id}/Audio.Audio'"`);
		lines.push(line.join(','));
	});

	return lines.join('\r\n');
}