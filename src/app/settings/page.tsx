"use client"

import { PageHeader } from "~/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Switch } from "~/components/ui/switch"
import { Label } from "~/components/ui/label"
import { Separator } from "~/components/ui/separator"
import { getSettingsSections } from "~/data/settings"

/**
 * Settings page component
 */
export default function Settings() {
  const settingsSections = getSettingsSections()

  return (
    <div className="flex min-h-dvh flex-col">
      <PageHeader title="設定" showBack />

      <div className="flex-1 space-y-6 p-4">
        {settingsSections.map((section) => (
          <Card
            key={section.id}
            className={
              section.variant === "danger" ? "border-destructive/50" : undefined
            }
          >
            <CardHeader>
              <CardTitle
                className={`flex items-center space-x-2 ${
                  section.variant === "danger" ? "text-destructive" : ""
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item, index) => (
                <div key={item.id}>
                  {item.type === "switch" ? (
                    <div className="flex items-center justify-between">
                      <Label htmlFor={item.id} className="text-sm font-medium">
                        {item.label}
                      </Label>
                      <Switch id={item.id} defaultChecked={item.defaultValue} />
                    </div>
                  ) : (
                    <Button
                      variant={
                        section.variant === "danger" &&
                        item.id === "delete-account"
                          ? "destructive"
                          : section.variant === "danger" && item.id === "logout"
                            ? "outline"
                            : "outline"
                      }
                      className={`w-full justify-start ${
                        section.variant === "danger" && item.id === "logout"
                          ? "border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          : ""
                      }`}
                    >
                      {item.label}
                    </Button>
                  )}
                  {index < section.items.length - 1 &&
                    item.type === "switch" &&
                    section.items[index + 1]?.type === "switch" && (
                      <Separator />
                    )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
