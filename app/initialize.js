import { View } from 'curvature/base/View';
import { Cubes } from './cubes/Cubes';

import { Matrix } from 'matrix-api/Matrix';

if(location.pathname !== '/accept-sso')
{
	globalThis.addEventListener('DOMContentLoaded', function() {

		const home = new Cubes;

		home.render(document.body);
	});
}
else
{
	const baseUrl = 'https://matrix.org/_matrix';
	const matrix  = new Matrix(baseUrl);

	const query = new URLSearchParams(location.search);
	const token = query.get('loginToken');

	matrix.completeSso(token);
}