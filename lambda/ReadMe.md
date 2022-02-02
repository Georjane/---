### 8 Intents

| Intent Name | Intent Slot | Slot type | Sample Utterances 
| ----------- | ----------- | --------- | ------------------------ 
| CaptureWordIntent | word | AMAZON.SearchQuery | help me remember the word {word}
| ReadMeaningIntent | | | - yes the meaning is this - no i don't understand the meaning
| ReadSentenceIntent | | | - no i don't know any sentences - yes the sentence is this
| CaptureBookIntent | book | AMAZON.Book | - from the book {book}
| YesIntent | | | - yes
| NoIntent | | | - no
| ByeWordVoyage | | | - thank you
| CaptureWordSourceIntent | | | - {noResponse} I did not - {yesResponse} i did

benevolenteugenicstransaction
Sorry, the word, {word} , is not currently supported. please try benevolent, transaction, or eugenics.

### Testing
- open word voyage
- help me remember the word transaction
- from the book sapiens
- yes the sentence is this
- yes the meaning is this
- no
- yes
- thank you Alexa


wordsData = { 
  "benevolent": {  
    "word": "benevolent",
    "roots": [ 'ben, bene', 'vol, volunt, volupt', 'ent'],
    "root meaning" : ['good, well', 'free will, free choice, to wish, personal desire', 'quality of, state of, that which'],
    "sentence": "The students finally realized that their principal was a kind and benevolent man.",
    "definition": "Characterized by or expressing goodwill or kindly feelings." 
  },
  "eugenics": {  
    "word": "eugenics",
    "roots": [ 'eu, ev', 'gen, gend, gene, geno, gon', '	ics'],
    "root meaning" : ['good, well, normal; happy, pleasing', 'race, kind, type, class, kin, birth, creation, sex, produce, offspring', 'study of, knowledge of, process, practice, condition, science, place'],
    "sentence": "Eugenics was used as a justification for the racial policies of Nazi Germany.",
    "definition": "The study of how to arrange reproduction within a human population to increase the occurrence of heritable characteristics regarded as desirable. Developed largely by Sir Francis Galton as a method of improving the human race, eugenics was increasingly discredited as unscientific and racially biased during the 20th century, especially after the adoption of its doctrines by the Nazis in order to justify their treatment of Jews, disabled people, and other minority groups." 
    fix filter error on dasboard and log request in api. debug alexa skill error
  },
  "transaction": {  
    "word": "transaction",
    "roots": [ 'tran, trans', 'act', 'ion'],
    "root meaning" : ['across, through, over, beyond', 'do, act', 'a, result, act, process, state, quality of, that which'],
    "sentence": "The real estate transaction took many weeks to complete.",
    "definition": "The act or process of conducting business." 
  },
}