export const Majuscule = (phrase) => {
	
	let stringi = phrase.split('. ')
	let transform = ""
	let newString = ""
	let result = [];
	for (let i = 0; i < stringi.length ; i++) {
    	transform = stringi[i].slice(0, 1).toUpperCase()
      	newString = transform + stringi[i].slice(1)
      	result.push(newString)
    }
    return result.join('. ')
}