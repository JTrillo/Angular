/*let mensaje = "Hola";

const PRUEBA = "prueba";

if(true){
    let mensaje = "adios";
}

console.log(mensaje);*/
/*let prueba:any = 23;

prueba = "dostres";

let nombre:string = "Pedro";
let edad:number = 23;

let texto:string = `Hola ${nombre},
Tengo ${edad} años.
P.D.: ${prueba}.`;*/

/*function test(nombre:string="guay", apellidos?:string){

}

test();*/

/* //Desestructuración de objetos
let player = {
    position: "midfielder",
    games_played: 24,
    goals: 6
}

let player2 = {
    position: "striker",
    games_played: 20,
    goals: 5
}

let { position:p1_pos } = player;
let { position:p2_pos } = player2;
console.log(p1_pos, p2_pos);

//Desestructuración de arrays
let array:number[] = [1, 2, 3, 4, 5];
let [, , numero, , numero2] = array;
console.log(numero);
console.log(numero2);*/

//Promesas
let promesa = new Promise( function (resolve, reject){
    setTimeout( () =>{
        //resolve();
        reject();
    }, 1500);
})
promesa.then(()=>console.log("Todo bien, todo correcto"), ()=>console.log("Estamos en la B"));


interface Prueba{
    var1: string
}
