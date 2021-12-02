import Augmenter from "./model/Augmenter";
import { cwd } from "process";
import { Wit } from "./model/Wit";
import { WitToken } from "./secret";

(() => {
    const wit = new Wit(WitToken);
    // populate(
    //     "Μπορώ να συνδυάσω παιχνίδια στα Virtuals;",
    //     "Μπορείς να παίξεις παρολί συνδυάζοντας παιχνίδια από το ίδιο άθλημα ή και από διαφορετικά αθλήματα.",
    //     "virtual_sports_combine_info"
    // );
    wit.Meaning("πως υπολογισμος cash out");
    wit.Train([{
            text: "Content",
            intent: "key",
            entities: [],
            traits: [],
    }])
})();

// export async function populate(qst: string, ans: string, key: string) {
//     const augmenter = new Augmenter(cwd() + "/src/datasets");
//     augmenter.push([
//         {
//             qst,
//             ans,
//             key,
//         },
//     ]);
//     await augmenter.byTranslation();
//     IntentAndTrain(key, augmenter.getReadyForTrain(key));
// }
