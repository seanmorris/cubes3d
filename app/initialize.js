import { View } from 'curvature/base/View';
import { Cubes } from './cubes/Cubes';

globalThis.addEventListener('DOMContentLoaded', function() {

	const home = new Cubes;

	home.render(document.body);
});
