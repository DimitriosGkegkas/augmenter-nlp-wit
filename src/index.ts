import Augmenter from "./model/Augmenter";
import { cwd } from "process";
import { Wit } from "./model/Wit";
import { WitToken } from "./secret";

(() => {
    populate(
        "Μπορώ να συνδυάσω παιχνίδια στα Virtuals;",
        "Μπορείς να παίξεις παρολί συνδυάζοντας παιχνίδια από το ίδιο άθλημα ή και από διαφορετικά αθλήματα.",
        "virtual_sports_combine_info"
    );
})();

export async function populate(qst: string, ans: string, key: string) {
    const wit = new Wit(WitToken);
    const augmenter = new Augmenter(cwd() + "/src/datasets");
    augmenter.push([
        {
            qst,
            ans,
            key,
        },
    ]);
    await augmenter.byTranslation();
    wit.Train(augmenter.getReadyForTrain(key));
}
