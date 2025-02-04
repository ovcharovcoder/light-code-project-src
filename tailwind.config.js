const plugin = require('tailwindcss/plugin');

const rotateY = plugin(function ({ addUtilities}) {
	addUtilities ({
		'.rotate-y-180': {
			transform: 'rotateY(180deg)'
		},
		'.-rotate-y-180': {
			transform: 'rotateY(-180deg)'
		},
	})
}) 

module.exports = {
	content: ['./app/pages/*.html', './app/css/*.css'],
	theme: {
		extend: {
			colors: {
				'color-primary': '#01051e',
				'color-primary-light': '#020726',
				'color-primary-dark': '#000313',
				'color-secondary': '#ff7d3b',
				'color-grey': '#333333',
				'color-white': '#ffffff',
				'color-blob': '#a427df',
			},
		},
		container: {
			center: true,
			padding: {
				DEFAULT: '20px',
				md: '50px',
			},
		},
	},
	plugins: [rotateY],
};
