import { SectionEditor } from "@/components/admin/section-editor";
import { designFieldGroups, designFields } from "@/lib/admin-field-config";
import { designSettingsDefaults } from "@/lib/design-settings";
import type { EditorSnapshot } from "@/types/content-workflow";

export function DesignEditor({ initialSnapshot }: { initialSnapshot: EditorSnapshot<"design"> }) {
  return (
    <SectionEditor
      section="design"
      initialSnapshot={initialSnapshot}
      fields={designFields}
      fieldGroups={designFieldGroups}
      resetDraft={{
        value: designSettingsDefaults,
        title: "恢復預設設計",
        description: "Reset 只會把安全預設值建立為未發布草稿，不影響品牌、內容或目前公開網站；必須 Publish 才會生效。"
      }}
    />
  );
}
