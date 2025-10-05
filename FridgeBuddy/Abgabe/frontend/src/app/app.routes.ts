import { authGuard } from './core/guards/auth-guard';

export const routeConfig = {
	home: {
		path: '',
		title: 'Startseite',
		loadComponent: () =>
			import('./pages/home/home.page').then((m) => m.HomePage),
		data: { matIcon: 'home', shouldDisplayTitle: false },
	},
	myGroceries: {
		path: 'my-groceries',
		title: 'Meine Angebote',
		loadComponent: () =>
			import('./pages/my-groceries/my-groceries').then((m) => m.MyGroceries),
		canActivate: [authGuard],
		data: { matIcon: 'kitchen' },
	},
	myReservations: {
		path: 'my-reservations',
		title: 'Produkte abholen',
		loadComponent: () =>
			import('./pages/my-reservations/my-reservations').then(
				(m) => m.MyReservations,
			),
		canActivate: [authGuard],
		data: { matIcon: 'shopping_cart_checkout' },
	},
	groceryForm: {
		path: 'grocery-form',
		title: 'Lebensmittel anbieten',
		loadComponent: () =>
			import('./pages/grocery-form/grocery-form').then((m) => m.GroceryForm),
		canActivate: [authGuard],
		data: { matIcon: 'add_circle', shouldDisplayTitle: false },
	},
	login: {
		path: 'login',
		title: 'Login',
		loadComponent: () => import('./pages/login/login').then((m) => m.Login),
		data: { matIcon: 'login' },
	},
	logout: {
		path: 'logout',
		title: 'Logout',
		loadComponent: () => import('./pages/logout/logout').then((m) => m.Logout),
		data: { matIcon: 'logout' },
	},
	groceryDetail: {
		path: 'grocery-detail/:groceryId',
		title: 'Produktdetails',
		loadComponent: () =>
			import('./pages/grocery-detail/grocery-detail').then(
				(m) => m.GroceryDetail,
			),
		data: { matIcon: '', shouldDisplayTitle: false },
	},
	redirect: { path: '**', redirectTo: '/' }, // page not found -> redirect to homepage
} as const;
