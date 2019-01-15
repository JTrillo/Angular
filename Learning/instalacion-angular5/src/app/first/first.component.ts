import { Component } from '@angular/core';

@Component({
	selector: 'first',
	//template: 'Para escribir el html directamente aquí'
	templateUrl: './first.component.html'
})

export class FirstComponent{
	public text: string;

	//Las dos formas de declarar un array son equivalentes
	public links: Array<Link>;
	//public links : Link[];

	constructor(){
		this.text = 'Mi primer componente';
		this.links = [
			{ id:1, url: "https://angular.io/tutorial", text: "Tour of Heroes" },
			{ id:2, url: "https://github.com/angular/angular-cli/wiki", text: "CLI Documentation" },
			{ id:3, url: "https://blog.angular.io/", text: "Angular blog" },
			{ id:4, url: "https://www.youtube.com/watch?v=4wl4tH2Gcrs", text: "Let M3 Xplain"}
		];
	}
}

interface Link {
	id: number;
	url: string;
	text: string;
}