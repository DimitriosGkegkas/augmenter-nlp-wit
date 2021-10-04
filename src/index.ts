import Augmenter from "./model/augmenter";
import { cwd } from "process";
import { IntentAndTrain } from "./model/train";

// (() => {
//     populate(
//         "Τι είναι το Powerspin;",
//         "To Powerspin είναι ένα νέο παιχνίδι από τον ΟΠΑΠ. Ένας εικονικός τροχός γυρίζει και κληρώνει έναν αριθμό ή σύμβολο, που αποτελεί το νικητήριο αποτέλεσμα. Ο τροχός περιέχει 24 αριθμούς από το 1 έως το 24 χωρισμένους σε 3 ίσες χρωματικές ζώνες αλλά και 3 ίδια σύμβολα. Σε κάθε περιστροφή του τροχού, ο σταθερός δείκτης ορίζει το νικητήριο αποτέλεσμα.",
//         "powerspin_info"
//     );
// })();

export async function populate(qst: string, ans: string, key: string) {
    const augmenter = new Augmenter(cwd() + "/src/datasets");
    augmenter.push([
        {
            qst,
            ans,
            key,
        },
    ]);
    await augmenter.byTranslation();
    IntentAndTrain(key,augmenter.getReadyForTrain(key));
}