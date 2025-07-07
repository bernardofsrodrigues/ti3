
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarX, Clock } from 'lucide-react';
import { DayContentProps } from 'react-day-picker';

type Event = {
  id: string;
  title: string;
  date: Date;
  type: 'vaccination' | 'weight' | 'reproduction' | 'other';
};

interface CalendarEventsProps {
  events: Event[];
  className?: string;
}

const CalendarEvents: React.FC<CalendarEventsProps> = ({
  events,
  className
}) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  // Filter events for the selected date
  const filteredEvents = events.filter(event => 
    date && 
    event.date.getDate() === date.getDate() &&
    event.date.getMonth() === date.getMonth() &&
    event.date.getFullYear() === date.getFullYear()
  );

  // Function to determine if a date has events
  const isDayWithEvents = (day: Date) => {
    return events.some(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };

  // Create modifiers for dates with events
  const modifiers = {
    event: (date: Date) => isDayWithEvents(date),
  };

  // Create modifier classnames
  const modifiersClassNames = {
    event: "relative font-medium",
  };

  return (
    <Card className={cn("cattle-card", className)}>
      <CardHeader>
        <CardTitle>Próximos Eventos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border rounded-md p-4 pointer-events-auto"
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              // Custom CSS for dates with events (dot indicator)
              components={{
                DayContent: (props: DayContentProps) => {
                  const isEventDay = props.date && isDayWithEvents(props.date);
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="text-foreground">{props.date.getDate()}</div>
                      {isEventDay && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cattle-accent rounded-full" />
                      )}
                    </div>
                  );
                }
              }}
            />
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">
              {date ? (
                <>Eventos em {date.toLocaleDateString('pt-BR')}</>
              ) : (
                'Selecione uma data'
              )}
            </h3>
            
            {filteredEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
                <CalendarX size={36} />
                <p className="mt-2">Nenhum evento nesta data</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredEvents.map(event => (
                  <div 
                    key={event.id} 
                    className="p-3 border rounded-md flex items-start gap-2 bg-background hover:bg-muted/50 transition-colors"
                  >
                    <div className={cn(
                      "w-1 self-stretch rounded-full",
                      event.type === 'vaccination' && "bg-cattle-danger",
                      event.type === 'weight' && "bg-cattle-primary",
                      event.type === 'reproduction' && "bg-cattle-accent",
                      event.type === 'other' && "bg-cattle-secondary"
                    )} />
                    <div className="flex-1">
                      <p className="font-medium">{event.title}</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock size={12} className="mr-1" />
                        <span>{event.date.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-4">
        <Button size="sm">Ver Todos os Eventos</Button>
      </CardFooter>
    </Card>
  );
};

export default CalendarEvents;
