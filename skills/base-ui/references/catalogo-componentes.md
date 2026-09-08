<!-- GERADO por scripts/gen-component-catalog.mjs — não editar à mão. -->
<!-- source-hash: 42b3d4190bf96d25 -->

# Catálogo de componentes

Índice de 1 linha por componente exportado em `packages/react/src/components/index.ts`
(82 componentes). Para anatomia completa, props e exemplos de um
componente específico, leia o `.tsx` e o `.css` citados na última coluna — não
carregue os 84 de uma vez.

| Componente | Partes (compound) | Eixos de variante | CSS |
|---|---|---|---|
| `Accordion` | Accordion.Root, Accordion.Item, Accordion.Heading, Accordion.Trigger, Accordion.Panel, Accordion.Indicator, Accordion.Body | variant(default|surface|base), surface(base) | `packages/styles/components/accordion.css` |
| `Alert` | Alert.Root, Alert.Indicator, Alert.Content, Alert.Title, Alert.Description | status(accent|base|danger|base|default|base|success|base|warning|base), accent(base), danger(base), default(base), success(base), warning(base) | `packages/styles/components/alert.css` |
| `AlertDialog` | AlertDialog.Root, AlertDialog.Trigger, AlertDialog.Backdrop, AlertDialog.Container, AlertDialog.Dialog, AlertDialog.Header, AlertDialog.Heading, AlertDialog.Body, AlertDialog.Footer, AlertDialog.Icon, AlertDialog.CloseTrigger | size(cover|dialog|lg|dialog|md|dialog|sm|dialog|xs|dialog), cover(dialog), lg(dialog), md(dialog), sm(dialog), xs(dialog), status(accent|icon|danger|icon|default|icon|success|icon|warning|icon), accent(icon), danger(icon), default(icon), success(icon), warning(icon), variant(blur|backdrop|opaque|backdrop|transparent|backdrop), blur(backdrop), opaque(backdrop), transparent(backdrop) | `packages/styles/components/alert-dialog.css` |
| `Autocomplete` | Autocomplete.Root, Autocomplete.Trigger, Autocomplete.Value, Autocomplete.Indicator, Autocomplete.Popover, Autocomplete.Filter, Autocomplete.ClearButton | fullWidth(false|true|base|trigger), true(base|trigger), variant(primary|base|secondary|base), primary(base), secondary(base) | `packages/styles/components/autocomplete.css` |
| `Avatar` | Avatar.Root, Avatar.Image, Avatar.Fallback | color(accent|fallback|danger|fallback|default|fallback|success|fallback|warning|fallback), accent(fallback), danger(fallback), default(fallback), success(fallback), warning(fallback), size(lg|base|md|base|sm|base), lg(base), md(base), sm(base), variant(default|soft|base), soft(base) | `packages/styles/components/avatar.css` |
| `Badge` | Badge.Anchor, Badge.Label, Badge.Root | color(accent|base|danger|base|default|base|success|base|warning|base), accent(base), danger(base), default(base), success(base), warning(base), placement(base|base|base|base), size(lg|base|md|base|sm|base), lg(base), md(base), sm(base), variant(primary|base|secondary|base|soft|base), primary(base), secondary(base), soft(base) | `packages/styles/components/badge.css` |
| `Breadcrumbs` | Breadcrumbs.Root, Breadcrumbs.Item | — | `packages/styles/components/breadcrumbs.css` |
| `Button` | Button.Root | fullWidth(false|true), isIconOnly(true), size(lg|md|sm), variant(danger|ghost|outline|primary|secondary|tertiary) | `packages/styles/components/button.css` |
| `ButtonGroup` | ButtonGroup.Root, ButtonGroup.Separator | fullWidth(false|true|base), true(base), orientation(horizontal|base|vertical|base), horizontal(base), vertical(base) | `packages/styles/components/button-group.css` |
| `Calendar` | Calendar.Root, Calendar.Header, Calendar.Heading, Calendar.NavButton, Calendar.Grid, Calendar.GridHeader, Calendar.GridBody, Calendar.HeaderCell, Calendar.Cell, Calendar.CellIndicator, Calendar.YearPickerTrigger, Calendar.YearPickerTriggerHeading, Calendar.YearPickerTriggerIndicator, Calendar.YearPickerGrid, Calendar.YearPickerGridBody, Calendar.YearPickerCell | — | `packages/styles/components/calendar.css` |
| `CalendarYearPicker` | — | — | `packages/styles/components/calendar-year-picker.css` |
| `Card` | Card.Root, Card.Header, Card.Title, Card.Description, Card.Content, Card.Footer | variant(default|base|secondary|base|tertiary|base|transparent|base), default(base), secondary(base), tertiary(base), transparent(base) | `packages/styles/components/card.css` |
| `Checkbox` | Checkbox.Root, Checkbox.Content, Checkbox.Control, Checkbox.Indicator | variant(primary|base|secondary|base), primary(base), secondary(base) | `packages/styles/components/checkbox.css` |
| `CheckboxGroup` | — | variant(primary|secondary) | `packages/styles/components/checkbox-group.css` |
| `Chip` | Chip.Root, Chip.Label | color(accent|base|danger|base|default|base|success|base|warning|base), accent(base), danger(base), default(base), success(base), warning(base), size(lg|base|md|base|sm|base), lg(base), md(base), sm(base), variant(primary|base|secondary|base|soft|base|tertiary|base), primary(base), secondary(base), soft(base), tertiary(base) | `packages/styles/components/chip.css` |
| `CloseButton` | CloseButton.Root | variant(default) | `packages/styles/components/close-button.css` |
| `ColorArea` | ColorArea.Root, ColorArea.Thumb | showDots(false|true|base), true(base) | `packages/styles/components/color-area.css` |
| `ColorField` | ColorField.Root, ColorField.Group, ColorField.Input, ColorField.Prefix, ColorField.Suffix | fullWidth(false|true) | `packages/styles/components/color-field.css` |
| `ColorPicker` | ColorPicker.Root, ColorPicker.Trigger, ColorPicker.Popover | — | `packages/styles/components/color-picker.css` |
| `ColorSlider` | ColorSlider.Root, ColorSlider.Output, ColorSlider.Track, ColorSlider.Thumb | — | `packages/styles/components/color-slider.css` |
| `ColorSwatch` | ColorSwatch.Root | shape(circle|square), size(lg|md|sm|xl|xs) | `packages/styles/components/color-swatch.css` |
| `ColorSwatchPicker` | ColorSwatchPicker.Root, ColorSwatchPicker.Item, ColorSwatchPicker.Swatch, ColorSwatchPicker.Indicator | layout(grid|base|stack|base), grid(base), stack(base), size(lg|base|md|base|sm|base|xl|base|xs|base), lg(base), md(base), sm(base), xl(base), xs(base), variant(circle|base|square|base), circle(base), square(base) | `packages/styles/components/color-swatch-picker.css` |
| `ComboBox` | ComboBox.Root, ComboBox.InputGroup, ComboBox.Value, ComboBox.Trigger, ComboBox.Popover | fullWidth(false|true|base|inputGroup), true(base|inputGroup) | `packages/styles/components/combo-box.css` |
| `DateField` | DateField.Root, DateField.Group, DateField.Input, DateField.InputContainer, DateField.Segment, DateField.Prefix, DateField.Suffix | fullWidth(false|true) | `packages/styles/components/date-field.css` |
| `DatePicker` | DatePicker.Root, DatePicker.Trigger, DatePicker.TriggerIndicator, DatePicker.Popover | — | `packages/styles/components/date-picker.css` |
| `DateRangePicker` | DateRangePicker.Root, DateRangePicker.Trigger, DateRangePicker.TriggerIndicator, DateRangePicker.RangeSeparator, DateRangePicker.Popover | — | `packages/styles/components/date-range-picker.css` |
| `Description` | Description.Root | — | `packages/styles/components/description.css` |
| `Disclosure` | Disclosure.Root, Disclosure.Heading, Disclosure.Trigger, Disclosure.Content, Disclosure.Body, Disclosure.Indicator | — | `packages/styles/components/disclosure.css` |
| `DisclosureGroup` | DisclosureGroup.Root | — | `packages/styles/components/disclosure-group.css` |
| `Drawer` | Drawer.Root, Drawer.Trigger, Drawer.Backdrop, Drawer.Content, Drawer.Dialog, Drawer.Header, Drawer.Heading, Drawer.Body, Drawer.Footer, Drawer.Handle, Drawer.CloseTrigger | placement(bottom|content|dialog|left|content|dialog|right|content|dialog|top|content|dialog), bottom(content|dialog), left(content|dialog), right(content|dialog), top(content|dialog), variant(blur|backdrop|opaque|backdrop|transparent|backdrop), blur(backdrop), opaque(backdrop), transparent(backdrop) | `packages/styles/components/drawer.css` |
| `Dropdown` | Dropdown.Root, Dropdown.Trigger, Dropdown.Popover, Dropdown.Menu, Dropdown.Section, Dropdown.Item, Dropdown.ItemIndicator, Dropdown.SubmenuIndicator, Dropdown.SubmenuTrigger | — | `packages/styles/components/dropdown.css` |
| `EmptyState` | EmptyState.Root | — | `packages/styles/components/empty-state.css` |
| `ErrorMessage` | ErrorMessage.Root | — | `packages/styles/components/error-message.css` |
| `FieldError` | FieldError.Root | — | `packages/styles/components/field-error.css` |
| `Fieldset` | Fieldset.Root, Fieldset.Legend, Fieldset.Group, Fieldset.Actions | — | `packages/styles/components/fieldset.css` |
| `Form` | Form.Root | (sem .styles.ts) | `packages/styles/components/form.css` |
| `Header` | — | — | `packages/styles/components/header.css` |
| `Input` | Input.Root | fullWidth(false|true), variant(primary|secondary) | `packages/styles/components/input.css` |
| `InputGroup` | InputGroup.Root, InputGroup.Input, InputGroup.TextArea, InputGroup.Prefix, InputGroup.Suffix | fullWidth(false|true|base), true(base), variant(primary|base|secondary|base), primary(base), secondary(base) | `packages/styles/components/input-group.css` |
| `InputOtp` | InputOtp.Root, InputOtp.Group, InputOtp.Slot, InputOtp.Separator | variant(primary|base|secondary|base), primary(base), secondary(base) | `packages/styles/components/input-otp.css` |
| `Kbd` | Kbd.Root, Kbd.Abbr, Kbd.Content | variant(default|light) | `packages/styles/components/kbd.css` |
| `Label` | Label.Root | isDisabled(true), isInvalid(true), isRequired(true) | `packages/styles/components/label.css` |
| `Link` | Link.Root, Link.Icon | — | `packages/styles/components/link.css` |
| `ListBox` | ListBox.Root, ListBox.Item, ListBox.ItemIndicator, ListBox.Section | variant(danger|default) | `packages/styles/components/list-box.css` |
| `ListBoxItem` | ListBoxItem.Root, ListBoxItem.Indicator | variant(danger|item|default|item), danger(item), default(item) | `packages/styles/components/list-box-item.css` |
| `ListBoxSection` | — | — | `packages/styles/components/list-box-section.css` |
| `Menu` | Menu.Root, Menu.Item, Menu.ItemIndicator, Menu.Section | — | `packages/styles/components/menu.css` |
| `MenuItem` | MenuItem.Root, MenuItem.Indicator, MenuItem.SubmenuIndicator | variant(danger|item|default|item), danger(item), default(item) | `packages/styles/components/menu-item.css` |
| `MenuSection` | — | — | `packages/styles/components/menu-section.css` |
| `Meter` | Meter.Root, Meter.Output, Meter.Track, Meter.Fill | color(accent|base|danger|base|default|base|success|base|warning|base), accent(base), danger(base), default(base), success(base), warning(base), size(lg|base|md|base|sm|base), lg(base), md(base), sm(base) | `packages/styles/components/meter.css` |
| `Modal` | Modal.Root, Modal.Trigger, Modal.Backdrop, Modal.Container, Modal.Dialog, Modal.Header, Modal.Icon, Modal.Heading, Modal.Body, Modal.Footer, Modal.CloseTrigger | scroll(inside|body|dialog|outside|body|container|dialog), inside(body|dialog), outside(body|container|dialog), size(cover|dialog|full|container|dialog|lg|dialog|md|dialog|sm|dialog|xs|dialog), cover(dialog), full(container|dialog), lg(dialog), md(dialog), sm(dialog), xs(dialog), variant(blur|backdrop|opaque|backdrop|transparent|backdrop), blur(backdrop), opaque(backdrop), transparent(backdrop) | `packages/styles/components/modal.css` |
| `NumberField` | NumberField.Root, NumberField.Group, NumberField.Input, NumberField.IncrementButton, NumberField.DecrementButton | fullWidth(false|true|base|group), true(base|group), variant(primary|base|secondary|base), primary(base), secondary(base) | `packages/styles/components/number-field.css` |
| `Pagination` | Pagination.Content, Pagination.Ellipsis, Pagination.Item, Pagination.Link, Pagination.Next, Pagination.NextIcon, Pagination.Previous, Pagination.PreviousIcon, Pagination.Root, Pagination.Summary | size(lg|base|md|base|sm|base), lg(base), md(base), sm(base) | `packages/styles/components/pagination.css` |
| `Popover` | Popover.Root, Popover.Trigger, Popover.Dialog, Popover.Arrow, Popover.Content, Popover.Heading | — | `packages/styles/components/popover.css` |
| `ProgressBar` | ProgressBar.Root, ProgressBar.Output, ProgressBar.Track, ProgressBar.Fill | color(accent|base|danger|base|default|base|success|base|warning|base), accent(base), danger(base), default(base), success(base), warning(base), size(lg|base|md|base|sm|base), lg(base), md(base), sm(base) | `packages/styles/components/progress-bar.css` |
| `ProgressCircle` | ProgressCircle.Root, ProgressCircle.Track, ProgressCircle.TrackCircle, ProgressCircle.FillCircle | color(accent|base|danger|base|default|base|success|base|warning|base), accent(base), danger(base), default(base), success(base), warning(base), size(lg|base|md|base|sm|base), lg(base), md(base), sm(base) | `packages/styles/components/progress-circle.css` |
| `Radio` | Radio.Root, Radio.Content, Radio.Control, Radio.Indicator | — | `packages/styles/components/radio.css` |
| `RadioGroup` | RadioGroup.Root | variant(primary|secondary) | `packages/styles/components/radio-group.css` |
| `RangeCalendar` | RangeCalendar.Root, RangeCalendar.Header, RangeCalendar.Heading, RangeCalendar.NavButton, RangeCalendar.Grid, RangeCalendar.GridHeader, RangeCalendar.GridBody, RangeCalendar.HeaderCell, RangeCalendar.Cell, RangeCalendar.CellIndicator, RangeCalendar.YearPickerTrigger, RangeCalendar.YearPickerTriggerHeading, RangeCalendar.YearPickerTriggerIndicator, RangeCalendar.YearPickerGrid, RangeCalendar.YearPickerGridBody, RangeCalendar.YearPickerCell | — | `packages/styles/components/range-calendar.css` |
| `ScrollShadow` | ScrollShadow.Root | hideScrollBar(false|true|base), true(base), orientation(horizontal|base|vertical|base), horizontal(base), vertical(base), variant(fade|base), fade(base) | `packages/styles/components/scroll-shadow.css` |
| `SearchField` | SearchField.Root, SearchField.Group, SearchField.Input, SearchField.SearchIcon, SearchField.ClearButton | fullWidth(false|true|base|group), true(base|group), variant(primary|base|secondary|base), primary(base), secondary(base) | `packages/styles/components/search-field.css` |
| `Select` | Select.Root, Select.Trigger, Select.Value, Select.Indicator, Select.Popover | fullWidth(false|true|base|trigger), true(base|trigger), variant(primary|base|secondary|base), primary(base), secondary(base) | `packages/styles/components/select.css` |
| `Separator` | Separator.Root | orientation(horizontal|vertical), variant(default|secondary|tertiary) | `packages/styles/components/separator.css` |
| `Skeleton` | Skeleton.Root | animationType(none|pulse|shimmer) | `packages/styles/components/skeleton.css` |
| `Slider` | Slider.Root, Slider.Output, Slider.Track, Slider.Fill, Slider.Thumb, Slider.Marks | — | `packages/styles/components/slider.css` |
| `Spinner` | Spinner.Root | color(accent|current|danger|success|warning), size(lg|md|sm|xl) | `packages/styles/components/spinner.css` |
| `Surface` | Surface.Root | variant(default|secondary|tertiary|transparent) | `packages/styles/components/surface.css` |
| `Switch` | Switch.Root, Switch.Content, Switch.Control, Switch.Thumb, Switch.Icon | size(lg|base|md|base|sm|base), lg(base), md(base), sm(base) | `packages/styles/components/switch.css` |
| `SwitchGroup` | SwitchGroup.Root | orientation(horizontal|base|vertical|base), horizontal(base), vertical(base) | `packages/styles/components/switch-group.css` |
| `Table` | Table.Body, Table.Cell, Table.Collection, Table.Column, Table.ColumnResizer, Table.Content, Table.Footer, Table.Header, Table.LoadMore, Table.LoadMoreContent, Table.ResizableContainer, Table.Root, Table.Row, Table.ScrollContainer, Table.SortableColumnHeader | variant(primary|base|secondary|base), primary(base), secondary(base) | `packages/styles/components/table.css` |
| `Tabs` | Tabs.Root, Tabs.ListContainer, Tabs.List, Tabs.Indicator, Tabs.Separator, Tabs.Panel | variant(primary|secondary|base), secondary(base) | `packages/styles/components/tabs.css` |
| `Tag` | Tag.Root, Tag.RemoveButton | size(lg|base|md|base|sm|base), lg(base), md(base), sm(base), variant(default|base|surface|base), default(base), surface(base) | `packages/styles/components/tag.css` |
| `TagGroup` | TagGroup.Root, TagGroup.List | — | `packages/styles/components/tag-group.css` |
| `Textarea` | Textarea.Root | fullWidth(false|true), variant(primary|secondary) | `packages/styles/components/textarea.css` |
| `Textfield` | Textfield.Root | fullWidth(false|true) | `packages/styles/components/textfield.css` |
| `TimeField` | TimeField.Root, TimeField.Group, TimeField.Input, TimeField.InputContainer, TimeField.Segment, TimeField.Prefix, TimeField.Suffix | fullWidth(false|true) | `packages/styles/components/time-field.css` |
| `Toast` | Toast.Provider, Toast.Content, Toast.Indicator, Toast.Title, Toast.Description, Toast.ActionButton, Toast.CloseButton, Toast.Queue | placement(bottom|region|toast|region|toast|region|toast|top|region|toast|region|toast|region|toast), bottom(region|toast), top(region|toast), variant(accent|toast|danger|toast|default|toast|success|toast|warning|toast), accent(toast), danger(toast), default(toast), success(toast), warning(toast) | `packages/styles/components/toast.css` |
| `ToggleButton` | ToggleButton.Root | isIconOnly(true), size(lg|md|sm), variant(default|ghost) | `packages/styles/components/toggle-button.css` |
| `ToggleButtonGroup` | ToggleButtonGroup.Root, ToggleButtonGroup.Separator | fullWidth(false|true|base), true(base), isDetached(false|true|base), true(base), orientation(horizontal|base|vertical|base), horizontal(base), vertical(base) | `packages/styles/components/toggle-button-group.css` |
| `Toolbar` | Toolbar.Root | isAttached(true), orientation(horizontal|vertical) | `packages/styles/components/toolbar.css` |
| `Tooltip` | Tooltip.Root, Tooltip.Trigger, Tooltip.Content, Tooltip.Arrow | — | `packages/styles/components/tooltip.css` |
| `Typography` | Typography.Root | align(center|end|justify|start), color(default|muted), truncate(true), type(body|code|h1|h2|h3|h4|h5|h6), weight(bold|medium|normal|semibold) | `packages/styles/components/typography.css` |
