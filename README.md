# This is a repo for a text dataset augmenter.
It has been created to train an NLP app for WIT.ai.

## Why Data augumentation?
Because data is in shortage when it comes to NLP, a simple method to achieve a better NLP training is through data augmentation. Data augmentation applies some transforms to the data in order to create different versions of the original data.

This is widely applied to Image Datasets but we can use the same principles to text as well. This augmenter uses a mix of the following transformations:
Random shuffle of the words of the sentence
Random insertion of important words
Random deletion of words in a sentence
Strip from stop words
Greek to greeklish
Cycle translate. Translate back to Greek after a few translations to other languages.

## Start
To start with this repo follow the steps below 

1. Clone this repo
2. Run yarn
3. Copy `secret.temp.ts` to a `secret.ts` file and save the wit token and google translate token.
4. Then, with `yarn run build` you can build the repo.

##### The main Function is `populate` that takes 3 arguments
**qst**: A string that represents the user’s question
**ans**: A string that represents the answer to the user’s question. This is only for creating a dataset file and is not used for the training.
**key**: A string that is used as the key to this question and as the intent of the question for the NLP training.

From one question the augmenter produces 60 sentences.

