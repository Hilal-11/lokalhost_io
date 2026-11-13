import { Schema , model , models } from "mongoose"
interface IFeedback {
    feedback_title: string,
    feedback_discription: string
}
const FeedbackSchema:Schema<IFeedback> = new Schema({
    feedback_title: { type: String, required: true, trim: true},
    feedback_discription: { type: String, required: true, trim: true }
}, { timestamps: true })

const Feedback = models.Feedback || model<IFeedback>("Feedback" , FeedbackSchema)
export default Feedback;