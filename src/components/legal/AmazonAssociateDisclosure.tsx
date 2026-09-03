import { AMAZON_ASSOCIATE_DISCLOSURE } from '../../lib/amazonAffiliate'

interface AmazonAssociateDisclosureProps {
  className?: string
}

export function AmazonAssociateDisclosure({ className = '' }: AmazonAssociateDisclosureProps) {
  return (
    <p
      className={`text-sm font-medium leading-relaxed text-brand-800/80 ${className}`.trim()}
      role="note"
    >
      {AMAZON_ASSOCIATE_DISCLOSURE}
    </p>
  )
}
