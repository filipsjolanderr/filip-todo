import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <Card className="max-w-4xl mx-auto border-none shadow-none">
        <CardContent className="pt-6">
          <div className="py-2">
            <h1 className="text-8xl font-bold mb-6 relative">
              Filip Sjölander
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Exploring the intersection of technology and creativity
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="default">
                View Projects
              </Button>
              <Button size="lg" variant="outline">
                Contact Me
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
