import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircleQuestion } from "lucide-react";

const Faq = () => {
  const faqs = [
    {
      question: "Where is Miala’s physical store located?",
      answer:
        "You can visit our store at 'Aiye Bus stop, 58 Osolo Way, Oshodi, Isolo, Lagos'. We’re open Monday to Saturday.",
    },
    {
      question: "Do you offer home delivery?",
      answer:
        "Yes, we do! Miala offers reliable home delivery within Lagos and nearby areas. Delivery time depends on your location, but most orders arrive the same day.",
    },
    {
      question: "How can I place an order?",
      answer:
        "You can order directly through our website or WhatsApp by sending us the product name and quantity. We’ll confirm availability and arrange delivery or pickup.",
    },
    {
      question: "Can I pay on delivery?",
      answer:
        "Yes, we accept payment on delivery within Lagos. For deliveries outside Lagos, prepayment is required.",
    },
    {
      question: "What if the product I ordered is out of stock?",
      answer:
        "If an item is unavailable, our team will notify you immediately and suggest an alternative product.",
    },
    {
      question: "Is Miala a trusted brand?",
      answer:
        "Yes, Miala is a trusted brand. We have a strong reputation for quality, innovation, and customer satisfaction.",
    },
    {
      question: "Can Miala products give me side effects?",
      answer:
        " No, Miala products are safe and non-toxic. If you have any concerns about side effects, please contact us, and we will be glad to assess your concerns.",
    },
  ];

  return (
    <section className="max-w-2xl mx-auto px-8 md:px-4 py-16">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="relative flex items-center justify-center mb-3">
          <div className="w-14 h-14 rounded-full border-2 border-pink-300 flex items-center justify-center bg-white shadow-sm">
            <MessageCircleQuestion className="w-6 h-6 text-pink-400" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Frequently Asked Questions
        </h2>
        <span className="w-32 h-1 bg-pink-300 mt-2 rounded-full" />
      </div>

      <Accordion type="single" collapsible className="w-full space-y-3">
        {faqs.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-base font-medium">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 text-sm">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default Faq;
