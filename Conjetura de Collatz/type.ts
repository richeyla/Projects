function collatz(n:number){
    const secuencia = [n.toString()];

    while(n !== 1){
        if( n % 2 === 0){
            n = n /2;
        }else{
            n = 3 * n + 1;
        }
        secuencia.push(n.toString());
    }
    secuencia.push(`pasos: ${secuencia.length}`)
    return secuencia;
}

console.log(collatz(20));