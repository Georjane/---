const axios = require("axios");
// let baseurl = 'http://localhost:3002/';
let baseurl = 'https://api.wordvoyage.com/';
let config = {
        timeout: 6500
    }

module.exports.fetchAuthorApi = async function fetchAuthorApisApi(book) {
    let url = baseurl + 'books';
    
    try {
        let response = await axios.get(url, config);
         if (response.data){
            if (response.data[Object.keys(response.data).find(key => key.toLowerCase() === book.toLowerCase())]) {
              if (response.data[Object.keys(response.data).find(key => key.toLowerCase() === book.toLowerCase())].book_author){
                return  response.data[Object.keys(response.data).find(key => key.toLowerCase() === book.toLowerCase())].book_author;
              }  else {
                  return null;  
                } 
            } else {
              return null;  
            }
         } else {
            return null; 
         }
         
    } catch (error) { 
        console.log('ERROR', error);
        return null;
    }
}

module.exports.fetchWordCountApi = async function fetchWordCountApisApi(book, word) {
    let url = baseurl + 'books/' + book + '/' + word;

    try {
        let response = await axios.get(url, config);
        if (response.data){
            return  response.data;
        } else {
          return 0;  
        }
    } catch (error) {
        console.log('ERROR', error);
        return 0;
    }
}

module.exports.fetchWordRootsApi = async function fetchWordRootsApisApi(word) {
    let url = baseurl + 'words/' + word;

    try {
        let response = await axios.get(url, config);
        if (response.data.roots){
            return  response.data.roots;
        } else {
          return [];  
        }
        
    } catch (error) {
        console.log('ERROR', error);
        return [];
    }
}

module.exports.fetchWordMeaningApi = async function fetchWordMeaningApisApi(word) {
    let url = baseurl + 'words/' + word;

    try {
        let response = await axios.get(url, config);
        if (response.data.meaning){
            return  response.data.meaning;
        } else {
          return null;  
        }
    } catch (error) {
        console.log('ERROR', error);
        return null;
    }
}